import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Brand } from './brand.entity';
import { ProductImage } from './product_images.entity';

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
    type: 'longtext',
    nullable: false,
  })
  description: string;

  @Column({
    type: 'decimal',
    nullable: false,
    default: 0.0,
  })
  price: number;

  @Column({
    nullable: false,
    default: 0,
  })
  stock: number;

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

  @OneToMany(() => ProductImage, (productimage) => productimage.product)
  images: ProductImage[];

  @ManyToOne(() => Category, (category) => category.product)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Brand, (brand) => brand.product)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;
}
