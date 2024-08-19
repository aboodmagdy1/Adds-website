import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/auth/decorators/roles.decorator';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  username: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  phone: string;

  @Prop()
  refreshToken: string;

  @Prop({ type: [String], enum: Role, default: [Role.User] })
  roles: Role[];

  @Prop({ default: false })
  approved: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
