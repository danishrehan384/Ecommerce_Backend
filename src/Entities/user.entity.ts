import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from 'utils/roles.enum';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    default: '',
    nullable: false,
    unique: true,
  })
  username: string;

  @Column({
    default: '',
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    default: '',
    nullable: false,
  })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Customer,
  })
  role: UserRole;

  @CreateDateColumn({
    type: 'datetime',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'datetime',
  })
  updated_at: Date;

  @Column({
    type: 'datetime',
    default: null,
  })
  deleted_at: Date;
}
