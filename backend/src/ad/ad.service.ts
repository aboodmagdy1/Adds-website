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
import { UserRepository } from 'src/users/user.repository';
import { EmailParams, EmailService } from 'src/utils/email/email.service';

@Injectable()
export class AdService {
  constructor(
    private adRepository: AdRepository,
    private cloudinaryService: CloudinaryService,
    private userRepository: UserRepository,
    private emailService: EmailService,
  ) {}

  private async ExtractUploadedFilesUrl(
    files: Express.Multer.File[] | unknown[],
  ): Promise<string[]> {
    const uploadedFiles: CloudinaryResponse[] = await Promise.all(
      files.map((file) => this.cloudinaryService.uploadFile(file)),
    );
    const imgUrls = uploadedFiles.map((file) => file.secure_url);
    return imgUrls;
  }
  async createAd(
    createDto: CreateAdDto,
    files: Express.Multer.File[] | unknown[],
    userid: Types.ObjectId,
  ) {
    const user = await this.userRepository.findOne({ _id: userid });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (!user.isVerified || !user.isApproved) {
      throw new BadRequestException('User is not verified or approved');
    }

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
    const ad = await this.adRepository.findOne(filter, null, {
      path: 'owner',
      select: 'email phone username -_id',
    });
    if (ad === null) {
      throw new BadRequestException(`Ad not found`);
    } else {
      return ad;
    }
  }
  async update(
    filter: FilterQuery<ADDocument>,
    updateDto: UpdateAdDto,
    files: Express.Multer.File[] | unknown[],
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
  async delete(filter: FilterQuery<ADDocument>) {
    return this.adRepository.findOneAndDelete(filter);
  }

  // reject or approve an existing document for admin
  async approveAd(filter: FilterQuery<ADDocument>): Promise<ADDocument> {
    try {
      const ad = await this.adRepository.findOne(filter);
      if (!ad) {
        throw new BadRequestException('Ad not found');
      }

      const owner = await this.userRepository.findOne({ _id: ad.owner });
      if (!owner) {
        throw new BadRequestException('Owner not found');
      }
      if (!owner.isVerified || !owner.isApproved) {
        throw new BadRequestException('Owner is not approved or verified');
      }

      ad.isApproved = !ad.isApproved; // toggle the approval status
      await ad.save();

      const emailParams: EmailParams = {
        recipientMail: owner.email,
        subject: 'Ad Approval',
        message: ad.isApproved
          ? 'Your ad has been approved successfully, now people can see it.'
          : 'Your ad has been unapproved, it is no longer visible.',
      };
      await this.emailService.sendEmail(emailParams);

      return ad;
    } catch (error) {
      // Add custom error handling or logging if needed
      throw error;
    }
  }

  // disable or enable
  async updateAdsForUser(
    userId: string,
    approve: boolean,
    subscriptionExpired: boolean,
  ) {
    await this.adRepository.updateMany(
      {
        owner: userId,
      },
      {
        isApproved: approve,
        ownerSubscriptionExpired: subscriptionExpired,
      },
    );
  }
}
