import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntitiy } from 'src/Entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntitiy])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
