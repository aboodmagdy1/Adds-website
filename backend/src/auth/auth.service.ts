import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UserRepository } from 'src/users/user.repository';
import { User, UserDocument } from 'src/users/user.schema';
import * as bcrypt from 'bcrypt';
import { SigninDto } from './dtos/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserDto } from 'src/users/dtos/user.dto';
import { Types } from 'mongoose';
@Injectable()
export class AuthService {
  constructor(
    private userRepostory: UserRepository,
    private jwtService: JwtService,
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
  async signin(signinBody: SigninDto): Promise<{ auth_token: string }> {
    const userId = await this.validateUser(
      signinBody.email,
      signinBody.password,
    );
    //create token
    const payload = { sub: userId };
    const token = await this.jwtService.signAsync(payload);
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
