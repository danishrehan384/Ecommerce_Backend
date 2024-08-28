import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Request } from 'express';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('Customer') 
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('/signup')
  create(@Body() createCustomerDto: CreateCustomerDto, @Req() req: Request) {
    return this.customerService.create(createCustomerDto, req);
  }

  @ApiSecurity('JWT-auth')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @Req() req: Request,
  ) {
    return this.customerService.update(id, updateCustomerDto, req);
  }

  @ApiSecurity('JWT-auth')
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.customerService.remove(id, req);
  }
}
