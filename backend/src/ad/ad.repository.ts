import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AD, ADDocument } from './ad.schema';
import { Model } from 'mongoose';
import { EntityRepository } from 'src/DB/entity.repository';

@Injectable()
export class AdRepository extends EntityRepository<ADDocument> {
  constructor(@InjectModel(AD.name) adModel: Model<ADDocument>) {
    super(adModel);
  }
}
