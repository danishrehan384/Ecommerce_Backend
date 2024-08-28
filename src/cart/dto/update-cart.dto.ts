import { PartialType } from '@nestjs/swagger';
import { CartDto } from './create-cart.dto';

export class UpdateCartDto extends PartialType(CartDto) {}
