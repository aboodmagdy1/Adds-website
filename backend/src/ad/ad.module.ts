import { Module } from '@nestjs/common';
import { AdController } from './ad.controller';
import { AdService } from './ad.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AD, ADSchema } from './ad.schema';
import { AdRepository } from './ad.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: AD.name, schema: ADSchema }])],
  controllers: [AdController],
  providers: [AdService, AdRepository],
})
export class AdModule {}
