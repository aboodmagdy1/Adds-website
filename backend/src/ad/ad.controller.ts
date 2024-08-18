import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateAdDto } from './dtos/create-ad.dto';
import { AdService } from './ad.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AdDto } from './dtos/ad-dto';

@Controller('ads')
@Serialize(AdDto)
export class AdController {
  constructor(private adService: AdService) {}

  @Post('')
  async createAd(@Body() createBody: CreateAdDto) {
    const newAd = await this.adService.createAd(createBody);
    return newAd;
  }

  @Get('')
  async getUsers() {
    return await this.adService.getAds({});
  }

  @Get(':id')
  async getAd(@Param('id') id: string) {
    return await this.adService.getAd({ _id: id });
  }
}
