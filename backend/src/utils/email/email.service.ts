import { MailerService } from '@nestjs-modules/mailer';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import e from 'express';

export interface EmailParams {
  recipientMail: string;
  subject: string;
  message: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  constructor(private mailerService: MailerService) {}

  private getHtmlContent(subject: string, message: string) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #007bff;
          color: #ffffff;
          padding: 20px;
          text-align: center;
        }
        .content {
          margin: 20px 0;
        }
        .content p {
          font-size: 16px;
          line-height: 1.5;
          color: #333333;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #777777;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${subject}</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>${message}</p>
          <p>Best regards,<br>ELMagd Services </p>
        </div>
        <div class="footer">
          <p>&copy; 2024 ELMagd Service. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  }

  async sendEmail(params: EmailParams) {
    const { recipientMail, subject, message } = params;
    if (!recipientMail || !subject || !message) {
      throw new InternalServerErrorException('Invalid email parameters');
    }

    const htmlContent = this.getHtmlContent(subject, message);

    try {
      await this.mailerService.sendMail({
        to: recipientMail,
        subject: subject,
        html: htmlContent,
      });
      this.logger.log(
        `Email sent to ${recipientMail} with subject Successfully`,
      );
    } catch (err) {
      this.logger.error('Error sending email', err);
      throw new InternalServerErrorException('Error sending email');
    }
  }
}
