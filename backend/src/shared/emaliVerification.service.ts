import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/users/user.schema';
import { EmailParams, EmailService } from 'src/utils/email/email.service';

@Injectable()
export class EmailVerificationService {
  constructor(
    private configService: ConfigService,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}
  async createAndSendVerificationEmail(user: UserDocument) {
    // create verification Token
    const verificationToken = await this.jwtService.signAsync(
      { sub: user },
      { expiresIn: '24h' },
    );
    user.verificationToken = verificationToken;
    await user.save();

    // send verification Email
    const verificationUrl = `${this.configService.get<string>(
      this.configService.get('NODE_ENV') == 'production'
        ? 'PRODUCTION_URL'
        : 'DEVELOPMENT_URL',
    )}/api/auth/verify-email?token=${verificationToken}`;

    const emailParams: EmailParams = {
      recipientMail: user.email,
      subject: 'Email Verification 📩',
      message: `Hello ${user.username}, welcome to our platform \n
      Please verify your email by clicking the link below before 24h \n
       : <p><a href="${verificationUrl}">Verify Your Email</a></p> `,
    };
    try {
      await this.emailService.sendEmail(emailParams);
    } catch (err) {
      console.error('Failed to send welcome email:', err);
    }
  }
}
