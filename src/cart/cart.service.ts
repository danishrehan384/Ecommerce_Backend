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

      const isCartAlreadyExist = await this._redis.get(cartKey);

      let items: CartItemDto = {
        id: uuidv4(),
        productid: productid,
        quantity: !quantity ? 1 : quantity,
        price: isProductExist.price,
      };

      if (!isCartAlreadyExist) {
        const totalPrice = isProductExist.price * items.quantity;
        let cart = {
          userid: userid,
          items: [items],
          total_price: totalPrice,
          created_at: new Date(),
          updated_at: new Date(),
        };
        await this._redis.set(cartKey, cart);
        const getCart = await this._redis.get(cartKey);

        return this._res.generateResponse(
          HttpStatus.OK,
          'cart added successfully',
          getCart,
          req,
        );
      }

      const findItemsInCart = isCartAlreadyExist.items;
      for (const item of findItemsInCart) {
        if (item.productid === productid) {
          item.quantity += quantity ? quantity : 1;
          let totalPrice = item.quantity * item.price;

          const updatedItems = {
            id: item.id,
            productid: item.productid,
            quantity: item.quantity,
            price: item.price,
          };

          const updatedCart = {
            userid: isCartAlreadyExist.userid,
            items: [updatedItems],
            total_price: totalPrice,
            created_at: isCartAlreadyExist.created_at,
            updated_at: new Date(),
          };

          await this._redis.set(cartKey, updatedCart);
        }else{
          let newItem = {
              id: uuidv4(),
              productid: productid,
              quantity: (!quantity) ? 1 : quantity,
              price: isProductExist.price,
          }
          let totalPrice = isProductExist.price * newItem.price;

          const updatedCart = {
            userid: isCartAlreadyExist.userid,
            items: [newItem],
            total_price: totalPrice,
            created_at: new Date(),
            updated_at: new Date(),
          };

          await this._redis.set(cartKey, updatedCart);
        }
      }

      const getCart = await this._redis.get(cartKey);

      return this._res.generateResponse(
        HttpStatus.OK,
        'cart added successfully',
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
