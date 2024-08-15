import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Logs {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  message: string;

  @Column({
    type: 'boolean',
    nullable: false,
  })
  isError: Boolean;

  @Column({
    nullable: false,
  })
  http_method: string;

  @Column({
    nullable: false,
  })
  route: string;

  @Column({
    type: 'bigint',
    nullable: false,
  })
  status_code: string;

  @CreateDateColumn({
    type: 'datetime',
  })
  created_at: Date;
}
