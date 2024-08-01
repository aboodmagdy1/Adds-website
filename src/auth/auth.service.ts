import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UserRepository } from 'src/users/user.repository';
import { User, UserDocument } from 'src/users/user.schema';
import * as bcrypt from 'bcrypt';
import { SigninDto } from './dtos/signin.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private userRepostory: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signin(signinBody: SigninDto): Promise<{ auth_token: string }> {
    const user = await this.userRepostory.findOne({ email: signinBody.email });
    // validate user
    if (!user || !(await bcrypt.compare(signinBody.password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }
    //create token
    const payload = { sub: user._id };
    const token = await this.jwtService.signAsync(payload);
    //send response
    return {
      auth_token: token,
    };
  }
}
