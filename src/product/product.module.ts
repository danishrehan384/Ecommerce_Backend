import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { SharedModule } from 'src/Shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/Entities/product.entity';
import { Category } from 'src/Entities/category.entity';
import { Brand } from 'src/Entities/brand.entity';
import { ProductImage } from 'src/Entities/product_images.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, Brand, ProductImage]),
    SharedModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
