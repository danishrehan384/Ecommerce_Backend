import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from 'src/Entities/brand.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseService } from 'src/Shared/services/response.service';
import { IsNull, Repository } from 'typeorm';
import { Request } from 'express';
import { UpdateCategoryDto } from 'src/category/dto/update-category.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand) private readonly _brandRepo: Repository<Brand>,
    private readonly _res: ResponseService,
  ) {}

  async create(body: CreateBrandDto, req: Request) {
    try {
      const { description, name } = body;

      const isBrandAlreadyExist = await this._brandRepo.findOne({
        where: {
          name: name,
          deleted_at: IsNull(),
        },
      });

      if (isBrandAlreadyExist)
        return this._res.generateResponse(
          HttpStatus.BAD_REQUEST,
          'This Brand is already exist',
          null,
          req,
        );

      const payload = {
        name: name,
        description: description,
      };

      const create = this._brandRepo.create(payload);
      await this._brandRepo.save(create);

      return this._res.generateResponse(
        HttpStatus.OK,
        'Brand is added successfully',
        create,
        req,
      );
    } catch (error) {
      return this._res.generateError(error, req);
    }
  }

  async findAll(req: Request) {
    try {
      const Brand_list = await this._brandRepo.find({
        where: {
          deleted_at: IsNull(),
        },
      });

      return this._res.generateResponse(
        HttpStatus.OK,
        'Brand list: ',
        Brand_list,
        req,
      );
    } catch (error) {
      return this._res.generateError(error, req);
    }
  }

  async findOne(id: string, req: Request) {
    try {
      const Brand = await this.findBrandByid(id, req);

      return this._res.generateResponse(HttpStatus.OK, 'Brand: ', Brand, req);
    } catch (error) {
      return this._res.generateError(error, req);
    }
  }

  async update(id: string, UpdateBrandDto: UpdateCategoryDto, req: Request) {
    try {
      const { description, name } = UpdateBrandDto;

      const Brand = await this.findBrandByid(id, req);

      await this._brandRepo
        .createQueryBuilder('brand')
        .update()
        .set({
          name: name,
          description: description,
        })
        .where('id = :id', { id })
        .execute();

      return this._res.generateResponse(
        HttpStatus.OK,
        'Brand updated successfully',
        [],
        req,
      );
    } catch (error) {
      return this._res.generateError(error, req);
    }
  }

  async remove(id: string, req: Request) {
    try {
      const category = await this.findBrandByid(id, req);

      await this._brandRepo
        .createQueryBuilder('brand')
        .update()
        .set({
          deleted_at: new Date(),
        })
        .where('id = :id', { id })
        .execute();

      return this._res.generateResponse(
        HttpStatus.OK,
        'Brand deleted successfully',
        [],
        req,
      );
    } catch (error) {
      return this._res.generateError(error, req);
    }
  }

  async findBrandByid(id: string, req: Request) {
    try {
      const Brand = await this._brandRepo.findOne({
        where: {
          id: id,
          deleted_at: IsNull(),
        },
      });

      if (!Brand)
        return this._res.generateResponse(
          HttpStatus.NOT_FOUND,
          'This Brand is not found',
          null,
          req,
        );

      return Brand;
    } catch (error) {
      return this._res.generateError(error, req);
    }
  }
}
