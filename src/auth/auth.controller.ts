import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SigninDto } from './dtos/signin.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  async signin(@Body() bodyData: SigninDto) {
    return await this.authService.signin(bodyData);
  }

  @UseGuards(AuthGuard)
  @Get('any')
  async getTest() {
    return 'Hello World';
  }
}
