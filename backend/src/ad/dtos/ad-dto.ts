import { Expose, Transform, Type } from 'class-transformer';
import { ADType, Ownership } from '../ad.schema';
import { User } from 'src/users/user.schema';
import { Types } from 'mongoose';
import { IsArray, IsNumber, IsString } from 'class-validator';

class AddressDto {
  @Expose()
  gov: string;
  @Expose()
  city: string;
}

export class AdDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  _id: string;
  @Expose()
  title: string;
  @Expose()
  price: number;
  @Expose()
  space: number;
  @Expose()
  @Type(() => AddressDto)
  address: Record<string, any>;
  @Expose()
  type: ADType;
  @Expose()
  ownershipState: Ownership;
  @Expose()
  @Transform(({ obj }) => obj.owner.toString())
  owner: string;
  @Expose()
  imgUrls: string[];

  @Expose()
  isApproved: boolean;

  @Expose()
  isPayed: boolean;
}

export class AdPaymentDto {
  @IsString()
  _id: string;
  @IsString()
  title: string;
  @IsNumber()
  price: number;
  @IsString()
  owner: string;
  @IsArray()
  imgUrls: string[];
}
