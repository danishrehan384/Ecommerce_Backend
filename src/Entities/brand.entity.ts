import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    nullable: false,
    default: '',
  })
  name: string;
  @Column({
    type: 'text',
    nullable: false,
  })
  description: string;

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

  @OneToMany(() => Product, (product) => product.brand)
  product: Product[];
}
