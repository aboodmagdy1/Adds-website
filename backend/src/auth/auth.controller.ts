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
import { Types } from 'mongoose';
import { currentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt.guard';

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
    @currentUser() userId: Types.ObjectId,
  ) {
    return this.authService.signin(userId, res);
  }

  @Post('signup')
  async signup(@Body() bodyData: CreateUserDto) {
    return await this.authService.signup(bodyData);
  }

  @Get('verify')
  @UseGuards(JwtAuthGuard)
  async verifyUser(@Req() req: Request) {
    return req.user; // if the user is verified, the request will be send 200 status code
    //  else the authGuard will throw unOtriggered exception
  }
}
