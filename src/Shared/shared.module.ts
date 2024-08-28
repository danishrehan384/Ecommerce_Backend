import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logs } from 'src/Entities/logs.entity';
import { ResponseService } from './services/response.service';
import { RedisService } from './services/redis.service';
@Module({
  imports: [TypeOrmModule.forFeature([Logs])],
  providers: [ResponseService, RedisService],
  exports: [ResponseService, RedisService],
})
export class SharedModule {}
