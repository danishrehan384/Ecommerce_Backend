import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/Shared/shared.module';
import { Brand } from 'src/Entities/brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Brand]), SharedModule],
  controllers: [BrandController],
  providers: [BrandService],
  exports: [BrandService]
})
export class BrandModule {}
