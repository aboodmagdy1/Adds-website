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
      throw new UnauthorizedException('credentials are not valid');
    }
  }

  async validateRefreshToken(userId: Types.ObjectId, refreshToken: string) {
    try {
      const user = await this.userRepostory.findOne({ _id: userId });
      const authenticated = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );
      if (!authenticated) {
        throw new UnauthorizedException();
      }
      return user._id;
    } catch (err) {
      throw new UnauthorizedException('Refresh token is not valid');
    }
  }
  async signin(
    userID: Types.ObjectId,
    res: Response,
  ): Promise<{ auth_token: string }> {
    //   the local auth guard make the validation and include the userid in the req object

    //create  access token
    const payload = { sub: userID };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });
    const user = await this.userRepostory.findOneAndUpdate(
      { _id: userID },
      { refreshToken: await bcrypt.hash(refreshToken, 10) },
    );
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') == 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    //  set it in cookies
    res.cookie('auth_token', accessToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') == 'production',
      maxAge: 1000 * 60 * 60 * 24 * 1,
    });
    //send response
    return {
      auth_token: accessToken,
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
