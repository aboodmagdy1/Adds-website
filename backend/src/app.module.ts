import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdModule } from './ad/ad.module';
import { EmailModule } from './utils/email/email.module';
import { EmailService } from './utils/email/email.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri:
          configService.get<string>('NODE_ENV') == 'production'
            ? configService.get<string>('MONGO_URI_PROD')
            : configService.get<string>('MONGO_URI_DEV'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    AdModule,
    EmailModule,
    CloudinaryModule,
    SharedModule,
  ],
  providers: [EmailService],
})
export class AppModule {}
