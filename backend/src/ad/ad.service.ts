import { Injectable } from '@nestjs/common';
import { CreateAdDto } from './dtos/create-ad.dto';
import { AdRepository } from './ad.repository';
import { FilterQuery } from 'mongoose';

@Injectable()
export class AdService {
  constructor(private adRepository: AdRepository) {}
  async createAd(createDto: CreateAdDto) {
    return this.adRepository.create(createDto);
  }

  async getAds(filter: any) {
    return this.adRepository.findAll(filter);
  }

  async getAd(filter: any) {
    return this.adRepository.findOne(filter);
  }
}
