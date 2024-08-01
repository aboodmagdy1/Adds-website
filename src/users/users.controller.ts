import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Post()
  async register(@Body() bodyData: CreateUserDto) {
    const newUser = await this.userService.create(bodyData);
    return newUser;
  }
  @Get('')
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
    return await this.userService.update({ _id: id }, bodyData);
  }
}
