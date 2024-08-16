import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/Entities/user.entity';
import { SharedModule } from 'src/Shared/shared.module';
import { AuthController } from './auth.controller';
import { localStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStartegy } from './strategy/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    SharedModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_KEY'),
        signOptions: {
          expiresIn: config.get<string>('EXPIRES_AT') + 's',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [localStrategy, JwtStartegy],
  exports: [],
})
export class AuthModule {}
