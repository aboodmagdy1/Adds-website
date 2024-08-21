import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.schema';
import { ApprovalDto, UpdateUserDto } from './dtos/update-user.dto';
import { FilterQuery, Mongoose, Types } from 'mongoose';
import { Role } from 'src/auth/decorators/roles.decorator';
import { EmailParams, EmailService } from 'src/utils/email/email.service';
import { use } from 'passport';
import { EmailVerificationService } from 'src/shared/emaliVerification.service';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UserRepository,
    private emailService: EmailService,
    private emailVerificationService: EmailVerificationService,
  ) {}

  async getUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ _id: userId });
    if (!user) {
      throw new BadRequestException(`User with id ${userId} not found`);
    } else {
      return user;
    }
  }
  async getUsers(filter: FilterQuery<User>) {
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
      // if the admin create the user this mean this one is approved
      const newuUser = await this.userRepository.create({
        ...bodyData,
        approved: true,
      });
      // send email Verification
      await this.emailVerificationService.createAndSendVerificationEmail(
        newuUser,
      );

      return newuUser;
    }
  }

  async update(
    filter: FilterQuery<User>,
    bodyData: UpdateUserDto,
  ): Promise<User> {
    return await this.userRepository.findOneAndUpdate(filter, { ...bodyData });
  }

  async delete(filter: FilterQuery<User>) {
    return this.userRepository.findOneAndDelete(filter);
  }

  // approve or reject user
  // user if approved after verification
  async approve(filter: FilterQuery<User>, approvalBody: ApprovalDto) {
    const user = await this.userRepository.findOneAndUpdate(filter, {
      role: approvalBody.role,
      approved: approvalBody.approved,
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const emailParams: EmailParams = {
      recipientMail: user.email,
      subject: 'Approval Emails',
      message: ` ${user.username}, ${user.approved ? `Your Successfully Approved` : 'sorry Your are rejected '} as ${user.role} in our platform`,
    };

    try {
      await this.emailService.sendEmail(emailParams);
    } catch (err) {
      console.error('Failed to send welcome email:', err);
    }

    return user;
  }
}
