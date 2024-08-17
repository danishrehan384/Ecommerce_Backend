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
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/Auth/Guards/role.guard';
import { UserRole } from 'utils/roles.enum';

@Controller('brand')
@ApiTags('Brand')
@ApiSecurity('JWT-auth')
@UseGuards(new RoleGuard(UserRole.Admin))
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  create(@Body() createBrandDto: CreateBrandDto, @Req() req) {
    return this.brandService.create(createBrandDto, req);
  }

  @Get()
  findAll(@Req() req) {
    return this.brandService.findAll(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.brandService.findOne(id, req);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,
    @Req() req,
  ) {
    return this.brandService.update(id, updateBrandDto, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.brandService.remove(id, req);
  }
}
