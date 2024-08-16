import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
@ApiTags('Login')
export class AuthController {

    constructor(private readonly jwt: JwtService){}


  @Post('/login')
  @UseGuards(AuthGuard('local'))
  login(@Body() loginDto: LoginDto, @Req() req) {
    return {
        token: this.jwt.sign(req.user)
    }
  }
}
