import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/Entities/user.entity';
import { SharedModule } from 'src/Shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), SharedModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
