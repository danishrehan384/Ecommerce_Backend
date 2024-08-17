import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAdminDto, SerializeAdmin } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/Entities/user.entity';
import { IsNull, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'utils/roles.enum';
import { ResponseService } from 'src/Shared/services/response.service';
import { Request } from 'express';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepo: Repository<User>,
    private readonly _res: ResponseService,
  ) {}

  async create(body: CreateAdminDto, request: Request) {
    try {
      const { email, password, username } = body;

      const isAdminAlreadyExist = await this._userRepo
        .createQueryBuilder('user')
        .where('username = :username OR email = :email', { username, email })
        .getOne();

      if (isAdminAlreadyExist)
        return this._res.generateResponse(
          HttpStatus.BAD_REQUEST,
          'This email or username is already register',
          null,
          request,
        );

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const payload = {
        username: username,
        email: email,
        password: hash,
        role: UserRole.Admin,
      };

      const createAdmin = this._userRepo.create(payload);
      await this._userRepo.save(createAdmin);

      return this._res.generateResponse(
        HttpStatus.OK,
        'Admin is created successfully',
        createAdmin,
        request,
      );
    } catch (error) {
      return this._res.generateError(error, request);
    }
  }

  async findAll(request: Request) {
    try {
      const admin = await this._userRepo.find({
        where: {
          role: UserRole.Admin,
        },
      });
      return this._res.generateResponse(
        HttpStatus.OK,
        'Admins list',
        admin,
        request,
      );
    } catch (error) {
      return this._res.generateError(error, request);
    }
  }

  async findOne(id: string, request: Request) {
    try {
      const admin = await this._userRepo.findOne({
        where: {
          id: id,
          role: UserRole.Admin,
        },
      });

      if (!admin)
        return this._res.generateResponse(
          HttpStatus.NOT_FOUND,
          'Admin not found',
          null,
          request,
        );
      return this._res.generateResponse(
        HttpStatus.OK,
        'Admin Data',
        admin,
        request,
      );
    } catch (error) {
      return this._res.generateError(error, request);
    }
  }

  async update(id: string, updateAdminDto: UpdateAdminDto, request: Request) {
    try {
      const { email, password, username } = updateAdminDto;
      const User = await this._userRepo.findOne({
        where: {
          id: id,
          deleted_at: IsNull(),
        },
      });

      if (!User)
        return this._res.generateResponse(
          HttpStatus.BAD_REQUEST,
          'User not found',
          null,
          request,
        );
      const getUserByEmailOrUsername = await this._userRepo
        .createQueryBuilder('user')
        .where('(username = :username OR email =:email) AND id != :id', {
          username,
          email,
          id,
        })
        .getOne();

      if (getUserByEmailOrUsername)
        return this._res.generateResponse(
          HttpStatus.BAD_REQUEST,
          'This Username OR Email is already register',
          null,
          request,
        );

      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        await this._userRepo
          .createQueryBuilder('user')
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
          'Admin is updated successfully',
          [],
          request,
        );
      }

      if (!password) {
        await this._userRepo
          .createQueryBuilder('user')
          .update()
          .set({
            username: username,
            email: email,
          })
          .where('id = :id', { id })
          .execute();

        return this._res.generateResponse(
          HttpStatus.OK,
          'Admin is updated successfully',
          [],
          request,
        );
      }
    } catch (error) {
      return this._res.generateError(error, request);
    }
  }

  async remove(id: string, request: Request) {
    try {
      const user = await this._userRepo.findOne({
        where: {
          id: id,
          deleted_at: IsNull(),
        },
      });

      if (!user)
        return this._res.generateResponse(
          HttpStatus.BAD_REQUEST,
          'User not found',
          null,
          request,
        );
      const deleteAdmin = await this._userRepo
        .createQueryBuilder('user')
        .update()
        .set({
          deleted_at: new Date(),
        })
        .where('id = :id', { id })
        .execute();

      return this._res.generateResponse(
        HttpStatus.OK,
        'Admin is deleted successfully',
        [],
        request,
      );
    } catch (error) {
      return this._res.generateError(error, request);
    }
  }

  async getAllUsers(request: Request) {
    try {
      const allUserList = await this._userRepo.find({
        where: {
          role: UserRole.Customer,
          deleted_at: IsNull(),
        },
      });

      return this._res.generateResponse(
        HttpStatus.OK,
        'Users List',
        allUserList,
        request,
      );
    } catch (error) {
      return this._res.generateError(error, request);
    }
  }

  async getUserByid(id: string, request: Request) {
    try {
      const getUser = await this._userRepo.findOne({
        where: {
          id: id,
          role: UserRole.Customer,
          deleted_at: IsNull(),
        },
      });

      if (!getUser)
        return this._res.generateResponse(
          HttpStatus.NOT_FOUND,
          'User not found',
          null,
          request,
        );

      return this._res.generateResponse(
        HttpStatus.OK,
        'Users List',
        getUser,
        request,
      );
    } catch (error) {
      return this._res.generateError(error, request);
    }
  }
}
