import { Expose } from 'class-transformer';
import { Role } from 'src/auth/decorators/roles.decorator';

export class UserDto {
  @Expose()
  username: string;
  @Expose()
  email: string;
  @Expose()
  phone: string;
  @Expose()
  roles: Role[];
}
