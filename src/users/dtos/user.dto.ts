import { Role } from 'src/auth/decorators/roles.decorator';

export class UserDto {
  username: string;
  email: string;
  phone: string;
  roles: Role[];
}
