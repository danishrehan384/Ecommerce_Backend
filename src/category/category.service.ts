import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/Entities/category.entity';
import { IsNull, Repository } from 'typeorm';
import { ResponseService } from 'src/Shared/services/response.service';
import { Request } from 'express';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly _catRepo: Repository<Category>,
    private readonly _res: ResponseService,
  ) {}

  async create(body: CreateCategoryDto, req: Request) {
    try {
      const { description, name } = body;

      const isCatAlreadyExist = await this._catRepo.findOne({
        where: {
          name: name,
          deleted_at: IsNull(),
        },
      });

      if (isCatAlreadyExist)
        return this._res.generateResponse(
          HttpStatus.BAD_REQUEST,
          'Category already exist',
          null,
          req,
        );

      const payload = {
        name: name,
        description: description,
      };

      const create = this._catRepo.create(payload);
      await this._catRepo.save(create);

      return this._res.generateResponse(
        HttpStatus.OK,
        'Category is added successfully',
        create,
        req,
      );
    } catch (error) {
      return this._res.generateError(error, req);
    }
  }

  async findAll(req: Request) {
    try {
      const category_list = await this._catRepo.find({
        where: {
          deleted_at: IsNull(),
        },
      });

      return this._res.generateResponse(
        HttpStatus.OK,
        'Category list: ',
        category_list,
        req,
      );
    } catch (error) {
      return this._res.generateError(error, req);
    }
  }

  async findOne(id: string, req: Request) {
    try {
      const category = await this.findCategoryByid(id, req);

      return this._res.generateResponse(
        HttpStatus.OK,
        'Category: ',
        category,
        req,
      );
    } catch (error) {
      return this._res.generateError(error, req);
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto, req: Request) {
    try {
      const { description, name } = updateCategoryDto;

      const category = await this.findCategoryByid(id, req);

      await this._catRepo
        .createQueryBuilder('cat')
        .update()
        .set({
          name: name,
          description: description,
        })
        .where('id = :id', { id })
        .execute();

      return this._res.generateResponse(
        HttpStatus.OK,
        'Category updated successfully',
        [],
        req,
      );
    } catch (error) {
      return this._res.generateError(error, req);
    }
  }

  async remove(id: string, req: Request) {
    try {
      const category = await this.findCategoryByid(id, req);

      await this._catRepo
        .createQueryBuilder('cat')
        .update()
        .set({
          deleted_at: new Date(),
        })
        .where('id = :id', { id })
        .execute();

      return this._res.generateResponse(
        HttpStatus.OK,
        'category deleted successfully',
        [],
        req,
      );
    } catch (error) {
      return this._res.generateError(error, req);
    }
  }

  async findCategoryByid(id: string, req: Request) {
    try {
      const category = await this._catRepo.findOne({
        where: {
          id: id,
          deleted_at: IsNull(),
        },
      });

      if (!category)
        return this._res.generateResponse(
          HttpStatus.NOT_FOUND,
          'category not found',
          null,
          req,
        );

      return category;
    } catch (error) {
      return this._res.generateError(error, req);
    }
  }
}
