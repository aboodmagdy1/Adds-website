import { Body, Controller, Post } from '@nestjs/common';
import { SigninDto } from './dtos/signin.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  async signin(@Body() bodyData: SigninDto) {
    return await this.authService.signin(bodyData);
  }
}
