import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Req,
  Res,
  BadRequestException,
  UseGuards,
  UploadedFiles,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  imageUpdateSchema,
  productUploadSchema,
} from 'utils/product-upload.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { Express, Request } from 'express';
import { RoleGuard } from 'src/Auth/Guards/role.guard';
import { UserRole } from 'utils/roles.enum';

@Controller('product')
@ApiTags('Product')
@ApiSecurity('JWT-auth')
@UseGuards(new RoleGuard(UserRole.Admin))
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary:
      'Upload multiple files with body data! Note: File must be in JPG, JGEP and PNG Format & file size more than 2 mb',
  })
  @ApiBody(productUploadSchema)
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueSuffix);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/jfif'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return cb(
            new BadRequestException('Only JPG, JPEG and PNG files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() file: Express.Multer.File[],
    @Req() req: Request,
  ) {
    const filename = file.map((file) => {
      return file.filename;
    });
    return this.productService.create(createProductDto, filename, req);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.productService.findAll(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.productService.findOne(id, req);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req,
  ) {
    return this.productService.update(id, updateProductDto, req);
  }

  @Put('/images/:id')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary:
      'Upload multiple files ! Note: File must be in JPG, JGEP and PNG Format & file size more than 2 mb',
  })
  @ApiBody(imageUpdateSchema)
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueSuffix);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return cb(
            new BadRequestException('Only JPG, JPEG and PNG files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }),
  )
  updateProductImages(
    @Param('id') id: string,
    @Req() req,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const filesname = files.map((file) => {
      return file.filename;
    });
    return this.productService.updateProductImages(id, filesname, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.productService.remove(id, req);
  }
}
