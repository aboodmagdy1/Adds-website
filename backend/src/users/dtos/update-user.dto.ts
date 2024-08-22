import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Role } from 'src/auth/decorators/roles.decorator';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class ApprovalDto {
  @IsBoolean()
  @IsNotEmpty()
  isApproved: boolean;
  @IsString()
  @IsNotEmpty()
  role: Role;
}
