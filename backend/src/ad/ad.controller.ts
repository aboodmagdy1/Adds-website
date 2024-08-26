import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CreateAdDto } from './dtos/create-ad.dto';
import { AdService } from './ad.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AdDto } from './dtos/ad-dto';
import { Role } from 'src/auth/decorators/roles.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { currentUser } from 'src/auth/decorators/current-user.decorator';
import { Types } from 'mongoose';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UpdateAdDto } from './dtos/ad-update';
@Controller('ads')
@Serialize(AdDto)
export class AdController {
  constructor(private adService: AdService) {}

  @Post('')
  @Auth(Role.Owner, Role.Admin, Role.Assistant)
  @UseInterceptors(
    FilesInterceptor('images', 6, {
      limits: { files: 6, fileSize: 10 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(new BadRequestException('Only Images Files Allowed'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  async createAd(
    @Body() createBody: CreateAdDto,
    @currentUser() userId: Types.ObjectId,
    @UploadedFiles() files: Express.Multer.File[] | unknown[],
  ) {
    const newAd = await this.adService.createAd(
      { ...createBody },
      files,
      userId,
    );
    return newAd;
  }

  // for public users
  @Get('')
  async getAds() {
    return await this.adService.getAds({ isApproved: true });
  }

  @Get('/my')
  @Auth(Role.Owner, Role.Admin, Role.Assistant)
  async getMyAds(@currentUser() userId: Types.ObjectId) {
    return await this.adService.getAds({ owner: userId });
  }

  @Get(':id')
  async getAd(@Param('id') id: string) {
    return await this.adService.getAd({ _id: id });
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Patch(':id/approve')
  @Auth(Role.Admin)
  async approveAd(@Param('id') id: string) {
    return this.adService.approveAd({ _id: id });
  }

  @Patch(':id')
  @Auth(Role.Owner, Role.Assistant, Role.Admin)
  @UseInterceptors(
    FilesInterceptor('images', 6, {
      limits: { files: 6, fileSize: 10 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(new BadRequestException('Only Images Files Allowed'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  async updateAd(
    @Param('id') id: string,
    @Body() updateAdBody: UpdateAdDto,
    @UploadedFiles() files: Express.Multer.File[] | unknown[],
    @currentUser() userId: Types.ObjectId,
  ) {
    return await this.adService.update(
      { _id: id },
      updateAdBody,
      files,
      userId,
    );
  }
}
