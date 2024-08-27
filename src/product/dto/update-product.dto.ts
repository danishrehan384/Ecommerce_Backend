import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsDecimal, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsOptional()
  @ApiProperty()
  @IsString()
  name: string;

  @IsOptional()
  @ApiProperty()
  @IsString()
  description: string;

  @IsOptional()
  @ApiProperty()
  @IsDecimal()
  price: number;

  @IsOptional()
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  stock: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  category_id: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  brand_id: string;
}
