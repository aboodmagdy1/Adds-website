import { Expose, Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { Role } from 'src/auth/decorators/roles.decorator';

export class UserDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  _id: string;
  @Expose()
  username: string;
  @Expose()
  email: string;
  @Expose()
  phone: string;
  @Expose()
  role: Role;
  @Expose()
  isVerified: boolean;
  @Expose()
  verificationToken: string;
  @Expose()
  isApproved: boolean;
}
