import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDecimal()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(()=>Number)
  stock: number;

  @IsString()
  @IsNotEmpty()
  category_id: string;

  @IsString()
  @IsNotEmpty()
  brand_id: string

  @IsArray()
  @ArrayMaxSize(5, {message: "You can upload a maximumn of 5 images"})
  @IsOptional()
  images?: Express.Multer.File[];
}
