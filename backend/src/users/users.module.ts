import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { EmailModule } from 'src/utils/email/email.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre('save', async function (next) {
            if (this.isModified('password')) {
              this.password = await bcrypt.hash(this.password, 10);
            }
            next();
          });

          return schema;
        },
      },
    ]),
    EmailModule,
    SharedModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UserRepository, UsersService],
})
export class UsersModule {}
