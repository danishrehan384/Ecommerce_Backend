import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/Entities/product.entity';
import { EntityManager, IsNull, Repository } from 'typeorm';
import { ResponseService } from 'src/Shared/services/response.service';
import { Request } from 'express';
import { ProductImage } from 'src/Entities/product_images.entity';
import { Category } from 'src/Entities/category.entity';
import { Brand } from 'src/Entities/brand.entity';
import * as fs from 'fs-extra';
import * as path from 'path';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private readonly _prodRepo: Repository<Product>,
    @InjectRepository(Category) private readonly _catRepo: Repository<Category>,
    @InjectRepository(Brand) private readonly _brandRepo: Repository<Brand>,
    @InjectRepository(ProductImage)
    private readonly _productImageRepo: Repository<ProductImage>,
    private readonly _res: ResponseService,
  ) {}

  async create(body: CreateProductDto, fileNames: string[], req: Request) {
    try {
      const { description, name, price, stock, category_id, brand_id } = body;

      const isProductAlreadyExist = await this._prodRepo.findOne({
        where: {
          name: name,
          deleted_at: IsNull(),
        },
      });

      if (isProductAlreadyExist)
        return this._res.generateResponse(
          HttpStatus.BAD_REQUEST,
          'This product is already exist',
          null,
          req,
        );

      const saveProductWithImages = await this._prodRepo.manager.transaction(
        async (manager: EntityManager) => {
          try {
            const category = await manager.findOne(Category, {
              where: {
                id: category_id,
              },
            });
            const brand = await manager.findOne(Brand, {
              where: {
                id: brand_id,
              },
            });

            if (!category)
              return this._res.generateResponse(
                HttpStatus.NOT_FOUND,
                'category not found',
                null,
                req,
              );

            if (!brand)
              return this._res.generateResponse(
                HttpStatus.NOT_FOUND,
                'This Brand is not found',
                null,
                req,
              );

            const payload = {
              name: name,
              description: description,
              price: price,
              stock: stock,
              category: category,
              brand: brand,
            };

            const createProduct = manager.create(Product, payload);

            const images = fileNames.map((imageFilename) => {
              const image = new ProductImage();
              image.image_url = `http://localhost:3000/api/v1/uploads/${imageFilename}`;
              image.product = createProduct;
              return image;
            });

            await manager.save(Product, createProduct);
            await manager.save(ProductImage, images);

            return createProduct;
          } catch (error) {
            const errorMessage = [
              'category not found',
              'This Brand is not found',
            ];
            if (!errorMessage.includes(error.message)) {
              throw new InternalServerErrorException(
                'Transaction failed, rolling back changes.',
              );
            }
            return this._res.generateError(error, req);
          }
        },
      );
      return this._res.generateResponse(
        HttpStatus.OK,
        'Product is added successfully',
        saveProductWithImages,
        req,
      );
    } catch (error) {
      return this._res.generateError(error, req);
    }
  }

  async findAll(req: Request) {
    try {
      const allProducts = await this._prodRepo.find({
        where: {
          deleted_at: IsNull(),
        },
        relations: {
          category: true,
          brand: true,
          images: true,
        },
        select: {
          category: {
            name: true,
          },
          brand: {
            name: true,
          },
          images: {
            image_url: true,
          },
        },
      });

      return this._res.generateResponse(
        HttpStatus.OK,
        'Product List: ',
        allProducts,
        req,
      );
    } catch (error) {
      return this._res.generateError(error, req);
    }
  }

  async findOne(id: string, req: Request) {
    try {
      const getProduct = await this.findProductById(id, req);
      return this._res.generateResponse(
        HttpStatus.OK,
        'Product Details: ',
        getProduct,
        req,
      );
    } catch (error) {
      return this._res.generateError(error, req);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto, req: Request) {
    try {
      const { brand_id, category_id, description, name, price, stock } =
        updateProductDto;
      const getProduct = await this.findProductById(id, req);
      const getbrand = await this._brandRepo.findOne({
        where: {
          id: brand_id,
          deleted_at: IsNull(),
        },
      });
      const getCategory = await this._catRepo.findOne({
        where: {
          id: category_id,
          deleted_at: IsNull(),
        },
      });
      await this._prodRepo
        .createQueryBuilder('product')
        .update()
        .set({
          name: name,
          description: description,
          price: price,
          stock: stock,
          brand: getbrand,
          category: getCategory,
        })
        .where('id = :id', { id })
        .execute();

      return this._res.generateResponse(
        HttpStatus.OK,
        'Product Updated Successfully',
        [],
        req,
      );
    } catch (error) {
      return this._res.generateError(error, req);
    }
  }

  async updateProductImages(id: string, imageFileName: string[], req: Request) {
    try {
      const getProduct = await this._prodRepo.findOne({
        where: {
          id: id,
          deleted_at: IsNull(),
        },
      });

      if (!getProduct)
        return this._res.generateResponse(
          HttpStatus.BAD_REQUEST,
          'Invalid Product id',
          null,
          req,
        );

      const getAllImagaes = await this._productImageRepo.find({
        where: {
          product: {
            id: id,
          },
        },
      });

      const extractOriginalFilePath = getAllImagaes.map((imageUrl) => {
        return imageUrl.image_url.replace('http://localhost:3000/api/v1', '.');
      });
      const delFile = extractOriginalFilePath.forEach(async (item) => {
        return await this.deleteFile(item, req);
      });

      getAllImagaes.forEach(async (item) => {
        await this._productImageRepo
          .createQueryBuilder('ProductImage')
          .delete()
          .where('image_url = :imageurl', { imageurl: item.image_url })
          .execute();
      });

      const images = imageFileName.map((filename) => {
        const image = new ProductImage();
        (image.image_url = `http://localhost:3000/api/v1/uploads/${filename}`),
          (image.product = getProduct);
        return image;
      });

      const create = this._productImageRepo.create(images);
      await this._productImageRepo.save(create);

      return this._res.generateResponse(
        HttpStatus.OK,
        'Product Images is updated successfully',
        [],
        req,
      );
    } catch (error) {
      return this._res.generateError(error, req);
    }
  }

  async remove(id: string, req: Request) {
    try {
      const getProduct = await this.findProductById(id, req);

      await this._prodRepo
        .createQueryBuilder('product')
        .update()
        .set({
          deleted_at: new Date(),
        })
        .where('id = :id', { id })
        .execute();

      return this._res.generateResponse(
        HttpStatus.OK,
        'Product is deleted successfully',
        getProduct,
        req,
      );
    } catch (error) {
      return this._res.generateError(error, req);
    }
  }

  async findProductById(id: string, req: Request) {
    try {
      const getProduct = await this._prodRepo.findOne({
        where: {
          id: id,
          deleted_at: IsNull(),
        },
        relations: {
          category: true,
          brand: true,
          images: true,
        },
        select: {
          category: {
            name: true,
          },
          brand: {
            name: true,
          },
          images: {
            image_url: true,
          },
        },
      });

      if (!getProduct)
        return this._res.generateResponse(
          HttpStatus.BAD_REQUEST,
          'Product not found',
          null,
          req,
        );

      return getProduct;
    } catch (error) {
      return this._res.generateError(error, req);
    }
  }

  async deleteFile(filePath: string, req: Request) {
    try {
      const fullPath = path.resolve(filePath);
      if (fullPath) {
        if (await fs.pathExists(fullPath)) {
          await fs.remove(fullPath);
        } else {
          throw new NotFoundException('File not found');
        }
      }
    } catch (error) {
      return this._res.generateError(error, req);
    }
  }
}
