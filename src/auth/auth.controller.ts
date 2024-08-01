import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SigninDto } from './dtos/signin.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  async signin(@Body() bodyData: SigninDto) {
    return await this.authService.signin(bodyData);
  }

  @UseGuards(AuthGuard)
  @Get('any')
  async getTest(@Req() req: Request) {
    return 'Hello World';
  }
}
