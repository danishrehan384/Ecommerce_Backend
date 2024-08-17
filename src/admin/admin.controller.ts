import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/Auth/Guards/role.guard';
import { UserRole } from 'utils/roles.enum';

@Controller('admin')
@ApiTags('Admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/signup')
  create(@Body() createAdminDto: CreateAdminDto, @Request() req) {
    return this.adminService.create(createAdminDto, req);
  }

  @ApiSecurity('JWT-auth')
  @Get()
  @UseGuards(new RoleGuard(UserRole.Admin))
  findAll(@Request() req) {
    return this.adminService.findAll(req);
  }

  @ApiSecurity('JWT-auth')
  @Get(':id')
  @UseGuards(new RoleGuard(UserRole.Admin))
  findOne(@Param('id') id: string, @Request() req) {
    return this.adminService.findOne(id, req);
  }

  @ApiSecurity('JWT-auth')
  @Patch(':id')
  @UseGuards(new RoleGuard(UserRole.Admin))
  update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @Request() req,
  ) {
    return this.adminService.update(id, updateAdminDto, req);
  }

  @ApiSecurity('JWT-auth')
  @Delete(':id')
  @UseGuards(new RoleGuard(UserRole.Admin))
  remove(@Param('id') id: string, @Request() req) {
    return this.adminService.remove(id, req);
  }

  @ApiSecurity('JWT-auth')
  @UseGuards(new RoleGuard(UserRole.Admin))
  @Get('/all/user')
  getAllUsers(@Request() req) {
    return this.adminService.getAllUsers(req);
  }

  @ApiSecurity('JWT-auth')
  @UseGuards(new RoleGuard(UserRole.Admin))
  @Get('/all/user/:id')
  getUserByid(@Param('id') id: string, @Request() req) {
    return this.adminService.getUserByid(id, req);
  }
}
