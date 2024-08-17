import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Brand } from './brand.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    default: '',
  })
  name: string;

  @Column({
    nullable: false,
    default: '',
  })
  description: string;

  @Column({
    type: 'decimal',
    nullable: false,
    default: 0.0,
  })
  price: number;

  @Column({
    type: 'bigint',
    nullable: false,
    default: 1,
  })
  stock: number;

  @Column({
    nullable: false,
    default: '',
  })
  image_url: string;

  @CreateDateColumn({
    type: 'datetime',
  })
  created_at: Date;

  @CreateDateColumn({
    type: 'datetime',
  })
  updated_at: Date;

  @Column({
    type: 'datetime',
    default: null,
  })
  deleted_at: Date;

  @ManyToOne(() => Category, (category) => category.product)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Brand, (brand) => brand.product)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;
}
