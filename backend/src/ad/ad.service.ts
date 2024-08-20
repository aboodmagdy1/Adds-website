import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateAdDto } from './dtos/create-ad.dto';
import { AdRepository } from './ad.repository';
import { FilterQuery, Types } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CloudinaryResponse } from 'src/cloudinary/cloudinary.response';
import { ADDocument } from './ad.schema';
import { UpdateAdDto } from './dtos/ad-update';

@Injectable()
export class AdService {
  constructor(
    private adRepository: AdRepository,
    private cloudinaryService: CloudinaryService,
  ) {}

  private async ExtractUploadedFilesUrl(
    files: Express.Multer.File[],
  ): Promise<string[]> {
    const uploadedFiles: CloudinaryResponse[] = await Promise.all(
      files.map((file) => this.cloudinaryService.uploadFile(file)),
    );
    const imgUrls = uploadedFiles.map((file) => file.secure_url);
    return imgUrls;
  }
  async createAd(
    createDto: CreateAdDto,
    files: Express.Multer.File[],
    userid: Types.ObjectId,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image is required');
    }
    const imgUrls = await this.ExtractUploadedFilesUrl(files);

    return this.adRepository.create({
      ...createDto,
      owner: userid,
      imgUrls: imgUrls,
    });
  }

  async getAds(filter: FilterQuery<ADDocument>) {
    return this.adRepository.find(filter);
  }

  async getAd(filter: FilterQuery<ADDocument>) {
    const ad = await this.adRepository.findOne(filter);
    if (ad === null) {
      throw new BadRequestException(`Ad not found`);
    } else {
      return ad;
    }
  }
  async update(
    filter: FilterQuery<ADDocument>,
    updateDto: UpdateAdDto,
    files: Express.Multer.File[],
    userId: Types.ObjectId,
  ) {
    //1) find the ad
    const ad = await this.adRepository.findOne(filter);
    if (ad === null) {
      throw new BadRequestException(`Ad not found`);
    }

    //2) check if the user is the owner of the ad
    if (ad.owner.toString() !== userId.toString()) {
      throw new ForbiddenException(`You are not the owner of this ad`);
    }

    //3) update the ad
    //3.1) update images
    let imgUrls: string[] = ad.imgUrls;
    if (files && files.length > 0) {
      const newUrls = await this.ExtractUploadedFilesUrl(files);
      imgUrls = [...imgUrls, ...newUrls];
    }
    //3.2) update the rest of the fields
    const updatedAd = await this.adRepository.findOneAndUpdate(filter, {
      ...updateDto,
      imgUrls: imgUrls,
    });

    return updatedAd;
  }
}
