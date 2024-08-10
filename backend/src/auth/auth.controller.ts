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
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('signin')
  @UseGuards(LocalAuthGuard) // local strategy
  async signin(
    @Body() bodyData: SigninDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
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

  @Get('verify')
  @UseGuards(AuthGuard)
  async verifyUser(@Req() req: Request) {
    return req.user; // if the user is verified, the request will be send 200 status code
    //  else the authGuard will throw unOtriggered exception
  }
}
