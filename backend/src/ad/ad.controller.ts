import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateAdDto } from './dtos/create-ad.dto';
import { AdService } from './ad.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AdDto } from './dtos/ad-dto';
import { Role, Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { currentUser } from 'src/auth/decorators/current-user.decorator';
import { Types } from 'mongoose';
import { User } from 'src/users/user.schema';
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
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const newAd = await this.adService.createAd(
      { ...createBody },
      files,
      userId,
    );
    return newAd;
  }

  @Get('')
  async getAds() {
    return await this.adService.getAds({});
  }

  @Get(':id')
  async getAd(@Param('id') id: string) {
    return await this.adService.getAd({ _id: id });
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
    @UploadedFiles() files: Express.Multer.File[],
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
