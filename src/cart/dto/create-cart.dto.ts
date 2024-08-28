import { ApiProperty } from '@nestjs/swagger';
import { Min } from 'class-validator';

export class CartDto {
  userid: string;
  items: CartItemDto[];
  total_price: number;
  created_at: Date;
  updated_at: Date;
}

export class CartItemDto {
  id: string;
  @ApiProperty()
  productid: string;
  @ApiProperty()
  quantity: number;
  price: number;
}
