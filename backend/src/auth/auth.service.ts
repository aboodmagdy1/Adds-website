import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UserRepository } from 'src/users/user.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';

export type TokenPayload = {
  sub: Types.ObjectId;
};

@Injectable()
export class AuthService {
  constructor(
    private userRepostory: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<Types.ObjectId> {
    try {
      const user = await this.userRepostory.findOne({ email });
      // validate user
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException();
      }
      return user._id;
    } catch (err) {
      throw new UnauthorizedException('vredentials are not valid');
    }
  }
  async signin(
    userID: Types.ObjectId,
    res: Response,
  ): Promise<{ auth_token: string }> {
    //   the local auth guard make the validation and include the userid in the req object

    //create token
    const payload = { sub: userID };
    const token = await this.jwtService.signAsync(payload);
    //  set it in cookies
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure:
        this.configService.get<string>('NODE_ENV') == 'production'
          ? true
          : false,
      maxAge: 1000 * 60 * 60 * 24 * 1,
    });
    //send response
    return {
      auth_token: token,
    };
  }

  async signup(signupBody: CreateUserDto) {
    const user = await this.userRepostory.findOne({ email: signupBody.email });
    if (user) {
      throw new BadRequestException('User already exists');
    }
    const newUser = await this.userRepostory.create(signupBody);
    return newUser;
  }
}
