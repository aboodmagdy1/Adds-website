import { Expose, Transform, Type } from 'class-transformer';
import { ADType, Ownership } from '../ad.schema';
import { User } from 'src/users/user.schema';

class AddressDto {
  @Expose()
  gov: string;
  @Expose()
  city: string;
}

export class AdDto {
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
  @Transform(({ value }) => value._id.toString())
  owner: string;
  @Expose()
  imgUrls: string[];
}
