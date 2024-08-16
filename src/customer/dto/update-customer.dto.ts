import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCustomerDto } from './create-customer.dto';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
    @ApiProperty()
    @IsOptional()
    @IsString()
    username: string;
  
    @ApiProperty()
    @IsOptional()
    @IsEmail()
    email: string;
  
    @ApiProperty()
    @IsOptional()
    @IsString()
    password: string;
}
