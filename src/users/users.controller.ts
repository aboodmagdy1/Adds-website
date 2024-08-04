import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Role, Roles } from 'src/auth/decorators/roles.decorator';
import { Request } from 'express';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  async register(@Body() bodyData: CreateUserDto, @Req() req: Request) {
    const newUser = await this.userService.create(bodyData);
    return newUser;
  }
  @Get('')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async getUsers() {
    const user = await this.userService.getUsers({});
    return user;
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }

  @Patch(':id')
  async updateUser(@Body() bodyData: UpdateUserDto, @Param('id') id: string) {
    const user = await this.userService.update({ _id: id }, bodyData);
    if (!user) {
      throw new NotFoundException('user not found');
    } else {
      return user;
    }
  }
}
