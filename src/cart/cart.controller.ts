import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartItemDto } from './dto/create-cart.dto';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('Cart')
@ApiSecurity('JWT-auth')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@Body() item: CartItemDto, @Req() req) {
    const userid = req.user.id;
    return this.cartService.create(userid, item, req);
  }

  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(+id, updateCartDto);
  }

  @Delete()
  remove(@Req() req) {
    const userid = req.user.id;
    return this.cartService.remove(userid, req);
  }
}
