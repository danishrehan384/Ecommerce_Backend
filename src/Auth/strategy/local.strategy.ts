import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy } from 'passport-local';
import { User } from 'src/Entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class localStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private readonly _userRepo: Repository<User>,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    try {
      const isUserExist = await this._userRepo
        .createQueryBuilder('user')
        .where(
          '(username = :username OR email = :email) AND deleted_at IS NULL',
          {
            username: email,
            email,
          },
        )
        .getOne();

      if (!isUserExist)
        throw new UnauthorizedException('Invalid Username Or Email Address');

      const checkPassword = await bcrypt.compare(
        password,
        isUserExist.password,
      );

      if (!checkPassword) throw new UnauthorizedException('Invalid Password');

      const payload = {
        id: isUserExist.id,
        username: isUserExist.username,
        email: isUserExist.email,
        role: isUserExist.role,
      };
      return payload;
    } catch (error) {
      console.log(error)
      throw new HttpException(error.message, error.status)
    }
  }
}
