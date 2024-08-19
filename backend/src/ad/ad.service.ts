import { Injectable } from '@nestjs/common';
import { CreateAdDto } from './dtos/create-ad.dto';
import { AdRepository } from './ad.repository';

@Injectable()
export class AdService {
  constructor(private adRepository: AdRepository) {}
  async createAd(createDto: CreateAdDto) {
    return this.adRepository.create(createDto);
  }

  async getAds(filter: any) {
    return this.adRepository.find(filter);
  }

  async getAd(filter: any) {
    return this.adRepository.findOne(filter);
  }
}
