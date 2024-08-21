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

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ unique: true, sparse: true }) // sparse: true allows multiple null values (delete the documents from the index table if this field is null)
  verificationToken: string;
  @Prop()
  password: string;

  @Prop()
  phone: string;

  @Prop()
  refreshToken: string;

  @Prop({ type: String, enum: Role, default: Role.Guest })
  role: Role;

  @Prop({ default: false })
  approved: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
