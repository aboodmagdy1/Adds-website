import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SigninDto } from './dtos/signin.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { Response } from 'express';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('signin')
  async signin(
    @Body() bodyData: SigninDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token: { auth_token: string } =
      await this.authService.signin(bodyData);
    res.cookie('auth_token', token.auth_token, {
      httpOnly: true,
      secure:
        this.configService.get<string>('NODE_ENV') == 'production'
          ? true
          : false,
      maxAge: 1000 * 60 * 60 * 24 * 1,
    });
  }

  @Post('signup')
  async signup(@Body() bodyData: CreateUserDto) {
    return await this.authService.signup(bodyData);
  }
}
