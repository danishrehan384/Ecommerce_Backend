import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { SharedModule } from 'src/Shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/Entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    SharedModule,
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
