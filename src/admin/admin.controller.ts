import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('admin')
@ApiTags('Admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  create(@Body() createAdminDto: CreateAdminDto, @Request() req) {
    return this.adminService.create(createAdminDto, req);
  }

  @Get()
  findAll(@Request() req) {
    return this.adminService.findAll(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.adminService.findOne(id, req);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @Request() req,
  ) {
    return this.adminService.update(id, updateAdminDto, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.adminService.remove(id, req);
  }
}
