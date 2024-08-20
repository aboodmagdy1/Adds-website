import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { ApprovalDto, UpdateUserDto } from './dtos/update-user.dto';
import { Role, Roles } from 'src/auth/decorators/roles.decorator';
import { Request } from 'express';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Types } from 'mongoose';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Auth(Role.Admin, Role.Assistant)
  @Post()
  async register(@Body() bodyData: CreateUserDto, @Req() req: Request) {
    const newUser = await this.userService.create(bodyData);
    return newUser;
  }
  @Auth(Role.Admin, Role.Assistant)
  @Get('')
  async getUsers() {
    const user = await this.userService.getUsers({});
    return user;
  }

  @Auth(Role.Admin, Role.Assistant)
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }

  @Auth(Role.Admin)
  @Patch(':id')
  async updateUser(@Body() bodyData: UpdateUserDto, @Param('id') id: string) {
    const user = await this.userService.update({ _id: id }, bodyData);
    if (!user) {
      throw new NotFoundException('user not found');
    } else {
      return user;
    }
  }

  @Auth(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const user = await this.userService.delete({ _id: id });
    return;
  }

  @Auth(Role.Admin)
  @HttpCode(HttpStatus.ACCEPTED)
  @Patch(':id/approve')
  async approveUser(
    @Param('id') id: string,
    @Body() approvalBody: ApprovalDto,
  ) {
    const user = await this.userService.approve({ _id: id }, approvalBody);
    return user;
  }
}
