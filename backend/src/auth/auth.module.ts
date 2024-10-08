import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LocalStrategy } from './strategies/local.strategy';
import { JWTStrategy } from './strategies/jwt.strategy';
import { JWTRefreshStrategy } from './strategies/refresh-token.strategy';
import { EmailModule } from 'src/utils/email/email.module';
import { EmailVerificationService } from 'src/shared/emaliVerification.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ConfigService,
    LocalStrategy,
    JWTStrategy,
    JWTRefreshStrategy,
    EmailVerificationService,
  ],
})
export class AuthModule {}
