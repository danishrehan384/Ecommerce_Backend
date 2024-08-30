import { HttpStatus, Injectable } from '@nestjs/common';
import { CartItemDto, CartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { RedisService } from 'src/Shared/services/redis.service';
import { ResponseService } from 'src/Shared/services/response.service';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/Entities/product.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Product) private readonly _prodRepo: Repository<Product>,
    private readonly _redis: RedisService,
    private readonly _res: ResponseService,
  ) {}

  private getCartkey(userid: string) {
    return `cart:${userid}`;
  }

  async create(userid, item: CartItemDto, req: Request) {
    try {
      const { productid, quantity } = item;
      const cartKey = this.getCartkey(userid);

      const isProductExist = await this._prodRepo.findOne({
        where: {
          id: productid,
          deleted_at: IsNull(),
        },
      });

      if (!isProductExist)
        return this._res.generateResponse(
          HttpStatus.OK,
          'Product not found',
          null,
          req,
        );

      let cart = await this._redis.get(cartKey);

      if (!cart) {
        cart = {
          userid: userid,
          items: [],
          total_price: 0,
          created_at: new Date(),
          updated_at: new Date(),
        };
      }

      const existingItemIndex = cart.items.findIndex(
        (i) => i.productid === productid,
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity || 1;
        cart.items[existingItemIndex].price = isProductExist.price;
      } else {
        cart.items.push({
          id: uuidv4(),
          productid: productid,
          quantity: quantity || 1,
          price: isProductExist.price,
        });
      }

      cart.total_price = cart.items.reduce((total, item) => {
        return total + item.quantity * item.price;
      }, 0);

      cart.updated_at = new Date();

      await this._redis.set(cartKey, cart);

      const getCart = await this._redis.get(cartKey);

      return this._res.generateResponse(
        HttpStatus.OK,
        'cart item added successfully',
        getCart,
        req,
      );
    } catch (error) {
      return this._res.generateError(error, req);
    }
  }

  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  async remove(id: string, req: Request) {
    try {
      const cartKey = this.getCartkey(id);
      await this._redis.del(cartKey);

      return this._res.generateResponse(
        HttpStatus.OK,
        'Remove item from cart successfuly',
        [],
        req,
      );
    } catch (error) {
      return this._res.generateError(error, req);
    }
  }
}
