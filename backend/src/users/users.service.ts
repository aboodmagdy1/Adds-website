import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.schema';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Mongoose, Types } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async getUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ _id: userId });
    if (!user) {
      throw new BadRequestException(`User with id ${userId} not found`);
    } else {
      return user;
    }
  }
  async getUsers(filter: any) {
    return this.userRepository.find(filter);
  }

  async create(bodyData: CreateUserDto): Promise<User> {
    const eixistUser = await this.userRepository.findOne({
      email: bodyData.email,
    });
    if (eixistUser !== null) {
      throw new BadRequestException(
        `User with email ${bodyData.email} already exist`,
      );
    } else {
      return this.userRepository.create(bodyData);
    }
  }

  async update(filter: any, bodyData: UpdateUserDto): Promise<User> {
    return await this.userRepository.findOneAndUpdate(filter, { ...bodyData });
  }

  async delete(filter: any) {
    return this.userRepository.findOneAndDelete(filter);
  }
}
