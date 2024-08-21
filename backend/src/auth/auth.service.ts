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
import { EmailParams, EmailService } from 'src/utils/email/email.service';

export type TokenPayload = {
  sub: Types.ObjectId;
};

@Injectable()
export class AuthService {
  constructor(
    private userRepostory: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
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

    // create user
    const newUser = await this.userRepostory.create(signupBody);

    // create verification Token
    const verificationToken = await this.jwtService.signAsync(
      { sub: newUser._id },
      { expiresIn: '24h' },
    );
    newUser.verificationToken = verificationToken;
    await newUser.save();

    // send verification Email
    const verificationUrl = `http://localhost:3000/api/auth/verify-email?token=${verificationToken}`;
    const emailParams: EmailParams = {
      recipientMail: newUser.email,
      subject: 'Email Verification 📩',
      message: `Hello ${newUser.username}, welcome to our platform \n
      Please verify your email by clicking the link below before 24h \n
       : <p><a href="${verificationUrl}">Verify Your Email</a></p> `,
    };

    try {
      await this.emailService.sendEmail(emailParams);
    } catch (err) {
      console.error('Failed to send welcome email:', err);
    }

    return newUser;
  }

  async verifyEmail(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      const user = await this.userRepostory.findOne({
        verificationToken: token,
      });
      if (!user) {
        throw new BadRequestException('Invalid or expired verification token');
      }
      user.verificationToken = null;
      user.isVerified = true;
      await user.save();

      return { message: 'Email successfully verified' };
    } catch (error: Error | any) {
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException('Verification token has expired');
      } else {
        console.log(error.stack);
        throw new BadRequestException('Invalid verification token');
      }
    }
  }
  async resendVerification(email: string) {
    // find user
    const user = await this.userRepostory.findOne({ email: email });
    // check if user already verified
    if (!user) {
      throw new BadRequestException('User not found ');
    }
    if (user.isVerified) {
      throw new BadRequestException('already verified');
    }
    // if not verified send verification email
    const verificationToken = await this.jwtService.signAsync(
      { sub: user._id },
      { expiresIn: '24h' },
    );
    user.verificationToken = verificationToken;
    await user.save();

    // send verification Email
    const verificationUrl = `http://localhost:3000/api/auth/verify-email?token=${verificationToken}`;
    const emailParams: EmailParams = {
      recipientMail: user.email,
      subject: 'Email Verification 📩',
      message: `Hello ${user.username}, welcome to our platform \n
      Please verify your email by clicking the link below before 24h \n
       : <p><a style="color:red;" href="${verificationUrl}">Verify Your Email</a></p> `,
    };

    await this.emailService.sendEmail(emailParams);
    return { message: 'Email verification send' };
  }

  // get logged user
  async getMe(userId: Types.ObjectId) {
    const user = await this.userRepostory.findOne({ _id: userId });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
