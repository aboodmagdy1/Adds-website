import { Module } from '@nestjs/common';
import { EmailVerificationService } from './emaliVerification.service';
import { EmailModule } from 'src/utils/email/email.module';

@Module({
  imports: [EmailModule],
  providers: [EmailVerificationService],
  exports: [EmailVerificationService],
})
export class SharedModule {}
