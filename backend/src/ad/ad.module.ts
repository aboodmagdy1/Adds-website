import { Module } from '@nestjs/common';
import { AdController } from './ad.controller';
import { AdService } from './ad.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AD, ADSchema } from './ad.schema';
import { AdRepository } from './ad.repository';
import { UsersModule } from 'src/users/users.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

import { EmailService } from 'src/utils/email/email.service';
import { EmailModule } from 'src/utils/email/email.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AD.name, schema: ADSchema }]),
    UsersModule,
    CloudinaryModule,
    EmailModule,
  ],
  controllers: [AdController],
  providers: [AdService, AdRepository],
  exports: [AdService],
})
export class AdModule {}
