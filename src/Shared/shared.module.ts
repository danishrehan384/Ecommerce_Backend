import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logs } from 'src/Entities/logs.entity';
import { ResponseService } from './services/response.service';
@Module({
  imports: [TypeOrmModule.forFeature([Logs])],
  providers: [ResponseService],
  exports: [ResponseService],
})
export class SharedModule {}
