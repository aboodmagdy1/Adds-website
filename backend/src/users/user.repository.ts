import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { FilterQuery, Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(userFilterQuery: FilterQuery<User>): Promise<UserDocument> {
    return this.userModel.findOne(userFilterQuery);
  }
  async findAll(userFilterQuery: FilterQuery<User>): Promise<User[]> {
    return this.userModel.find(userFilterQuery);
  }
  async create(user: Partial<User>): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findOneAndUpdate(
    userFilterQuery: FilterQuery<User>,
    user: Partial<User>,
  ): Promise<User> {
    const existingUser = await this.userModel.findOne(userFilterQuery);
    if (existingUser) {
      Object.assign(existingUser, user);
      return existingUser.save();
    } else {
      return null;
    }
  }
  async findOneAndDelete(userFilterQuery: FilterQuery<User>): Promise<User> {
    return this.userModel.findOneAndDelete(userFilterQuery);
  }
}
