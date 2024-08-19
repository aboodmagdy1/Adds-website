import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        let productionTransport = {
          host: configService.getOrThrow('GMAIL_EMAIL_HOST'),
          port: configService.getOrThrow('GMAIL_EMAIL_PORT'),
          secure: true,
          auth: {
            user: configService.getOrThrow('GMAIL_EMAIL_USER'),
            pass: configService.getOrThrow('GMAIL_EMAIL_PASSWORD'),
          },
        };
        let devTransport = {
          host: configService.getOrThrow('MAILTRAP_HOST'),
          port: configService.getOrThrow('MAILTRAP_PORT'),
          secure: false,
          auth: {
            user: configService.getOrThrow('MAILTRAP_EMAIL_USERNAME'),
            pass: configService.getOrThrow('MAILTRAP_EMAIL_PASSWORD'),
          },
        };

        return {
          transport:
            configService.get('NODE_ENV') === 'production'
              ? productionTransport
              : devTransport,
          defaults: {
            from: `"No Reply" <h1> ElMagd Services </h1>`,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
