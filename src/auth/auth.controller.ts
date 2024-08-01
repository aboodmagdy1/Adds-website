import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SigninDto } from './dtos/signin.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { Request } from 'express';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  async signin(@Body() bodyData: SigninDto) {
    return await this.authService.signin(bodyData);
  }

  @Post('signup')
  async signup(@Body() bodyData: CreateUserDto) {
    return await this.authService.signup(bodyData);
  }
}
