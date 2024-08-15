import { Injectable } from '@nestjs/common';
import { CreateAdminDto, SerializeAdmin } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntitiy } from 'src/Entities/user.entity';
import { IsNull, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'utils/roles.enum';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(UserEntitiy)
    private readonly _userRepo: Repository<UserEntitiy>,
  ) {}

  async create(body: CreateAdminDto) {
    try {
      const { email, password, username } = body;

      const isAdminAlreadyExist = await this._userRepo
        .createQueryBuilder('user')
        .where('username = :username OR email = :email', { username, email })
        .getOne();

      if (isAdminAlreadyExist)
        return { message: 'This username OR email is already exist' };

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

      return {
        message: 'Admin is created successfully',
      };
    } catch (error) {
      console.log(error);
    }
  }

  async findAll() {
    try {
      return await this._userRepo.find({
        where: {
          deleted_at: IsNull()
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async findOne(id: string) {
    return await this._userRepo.findOne({
      where: {
        id: id,
        deleted_at: IsNull()
      },
    });
  }

  async update(id: string, updateAdminDto: UpdateAdminDto) {
    try {
      const { email, password, username } = updateAdminDto;
      const User = await this._userRepo.findOne({
        where: {
          id: id,
          deleted_at: IsNull(),
        },
      });

      if (!User)
        return {
          message: 'User not found',
        };
      const getUserByEmailOrUsername = await this._userRepo
        .createQueryBuilder('user')
        .where('(username = :username OR email =:email) AND id != :id', {
          username,
          email,
          id,
        })
        .getOne();

      if (getUserByEmailOrUsername)
        return {
          message: 'This Username OR email is already register',
        };

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

        return {
          message: 'Admin is updated successfully',
        };
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

        return {
          message: 'Admin is updated successfully',
        };
      }
    } catch (error) {}
  }

  async remove(id: string) {
    try {
      const user = await this._userRepo.findOne({
        where: {
          id: id,
          deleted_at: IsNull(),
        },
      });

      if (!user)
        return {
          message: 'User not found',
        };

      const deleteAdmin = await this._userRepo
        .createQueryBuilder('user')
        .update()
        .set({
          deleted_at: new Date(),
        })
        .where('id = :id', { id })
        .execute();

      return {
        message: 'Admin is deleted successfully',
      };
    } catch (error) {
      console.log(error.message);
    }
  }
}
