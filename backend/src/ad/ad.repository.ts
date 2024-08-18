import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AD, ADDocument } from './ad.schema';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class AdRepository {
  constructor(@InjectModel(AD.name) private adModel: Model<ADDocument>) {}

  async create(ad: Partial<AD>): Promise<AD> {
    const newAd = new this.adModel(ad);
    return newAd.save();
  }

  async findAll(adQueryFileter: FilterQuery<AD>): Promise<AD[]> {
    return this.adModel.find(adQueryFileter);
  }

  async findOne(adQueryFileter: FilterQuery<AD>): Promise<AD> {
    return this.adModel.findOne(adQueryFileter);
  }
}
