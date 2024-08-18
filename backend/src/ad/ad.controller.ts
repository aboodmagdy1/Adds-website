import { Body, Controller, Post } from '@nestjs/common';
import { CreateAdDto } from './dtos/create-ad.dto';

@Controller('ads')
export class AdController {
  @Post('')
  createAd(@Body() createBody: CreateAdDto) {
    console.log(createBody);
  }
}
