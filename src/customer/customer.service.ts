import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/Entities/user.entity';
import { IsNull, Repository } from 'typeorm';
import { ResponseService } from 'src/Shared/services/response.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(User) private readonly _userRepo: Repository<User>,
    private readonly _res: ResponseService,
  ) {}

  async create(createCustomerDto: CreateCustomerDto, req: Request) {
    try {
      const { email, password, username } = createCustomerDto;
      const isCustomerIsAlreadyExist = await this._userRepo
        .createQueryBuilder('customer')
        .where('username = :username OR email = :email', { username, email })
        .getOne();

      if (isCustomerIsAlreadyExist) {
        return this._res.generateResponse(
          HttpStatus.BAD_REQUEST,
          'This username or email is already exist please try another',
          null,
          req,
        );
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const payload = {
        username: username,
        email: email,
        password: hashPassword,
      };

      const createCustomer = this._userRepo.create(payload);
      await this._userRepo.save(createCustomer);

      return this._res.generateResponse(
        HttpStatus.OK,
        'User is created successfully',
        createCustomer,
        req,
      );
    } catch (error) {
      return this._res.generateError(error, req);
    }
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto, req: Request) {
    try {
      const { email, password, username } = updateCustomerDto;

      const isCustomerExist = await this._userRepo.findOne({
        where: {
          id: id,
          deleted_at: IsNull(),
        },
      });

      if (!isCustomerExist)
        return this._res.generateResponse(
          HttpStatus.NOT_FOUND,
          'User not found',
          null,
          req,
        );

      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        await this._userRepo
          .createQueryBuilder('customer')
          .update()
          .set({
            username: username,
            email: email,
            password: hashPassword,
          })
          .where('id = :id', { id })
          .execute();

        return this._res.generateResponse(
          HttpStatus.OK,
          'User updated successfully',
          [],
          req,
        );
      }

      if (!password) {
        await this._userRepo
          .createQueryBuilder('customer')
          .update()
          .set({
            username: username,
            email: email,
          })
          .where('id = :id', { id })
          .execute();

        return this._res.generateResponse(
          HttpStatus.OK,
          'User updated successfully',
          [],
          req,
        );
      }
    } catch (error) {
      return this._res.generateError(error, req);
    }
  }

  async remove(id: string, req: Request) {
    try {
      const isCustomerExist = await this._userRepo.findOne({
        where: {
          id: id,
          deleted_at: IsNull(),
        },
      });

      if (!isCustomerExist)
        return this._res.generateResponse(
          HttpStatus.NOT_FOUND,
          'User not found',
          null,
          req,
        );

      await this._userRepo
        .createQueryBuilder('customer')
        .update()
        .set({
          deleted_at: new Date(),
        })
        .where('id = :id', { id })
        .execute();

        return this._res.generateResponse(
          HttpStatus.OK,
          'User deletedod successfully',
          [],
          req,
        );  
    } catch (error) {
      return this._res.generateError(error, req);
    }
  }
}
