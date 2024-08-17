import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/Auth/Guards/role.guard';
import { UserRole } from 'utils/roles.enum';

@Controller('category')
@ApiTags('Category')
@ApiSecurity('JWT-auth')
@UseGuards(new RoleGuard(UserRole.Admin))
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto, @Req() req) {
    return this.categoryService.create(createCategoryDto, req);
  }

  @Get()
  findAll(@Req() req) {
    return this.categoryService.findAll(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.categoryService.findOne(id, req);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Req() req,
  ) {
    return this.categoryService.update(id, updateCategoryDto, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.categoryService.remove(id, req);
  }
}
