import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { EmailModule } from 'src/utils/email/email.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [EmailModule, UsersModule, AuthModule],
  providers: [StripeService],
  controllers: [StripeController],
})
export class StripeModule {}
