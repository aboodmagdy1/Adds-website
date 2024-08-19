import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.schema';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async getUserById(userId: string) {
    return this.userRepository.findOne({ _id: userId });
  }
  async getUsers(filter: any) {
    return this.userRepository.find(filter);
  }

  async create(bodyData: CreateUserDto): Promise<User> {
    return this.userRepository.create(bodyData);
  }

  async update(filter: any, bodyData: UpdateUserDto): Promise<User> {
    return await this.userRepository.findOneAndUpdate(filter, { ...bodyData });
  }

  async delete(filter: any) {
    return this.userRepository.findOneAndDelete(filter);
  }
}
