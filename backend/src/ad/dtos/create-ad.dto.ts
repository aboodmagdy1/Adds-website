import { Type } from 'class-transformer';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  ValidateNested,
} from 'class-validator';
import { ADType, Ownership } from '../ad.schema';

export class AdressDto {
  @IsString()
  @IsNotEmpty()
  gov: string;

  @IsString()
  @IsNotEmpty()
  city: string;
}

export class CreateAdDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  space: number;

  @ValidateNested()
  @Type(() => AdressDto)
  @IsNotEmpty()
  address: AdressDto;

  @IsEnum(ADType)
  @IsNotEmpty()
  type: ADType;

  @IsEnum(Ownership)
  @IsNotEmpty()
  ownershipState: Ownership;

  @IsMongoId()
  @IsNotEmpty()
  owner: string;

  @IsUrl({}, { each: true })
  @IsOptional()
  imgUrls: string[];
}
