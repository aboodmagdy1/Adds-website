import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

import { User } from 'src/users/user.schema';

export enum ADType { //  نوع الشئ الي المعلن عنه
  Flat = 'flat',
  Building = 'building',
  FarmLand = 'farmland',
  EmptyLand = 'emptyLand',
}
export enum Ownership { //  نوع الملكية
  Selling = 'selling',
  Rent = 'rent',
}

interface Address {
  gov: string;
  city: string;
}

export type ADDocument = HydratedDocument<AD>;

@Schema({ timestamps: true })
export class AD {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  space: number;

  @Prop(
    raw({
      gov: { type: String, required: true },
      city: { type: String, required: true },
    }),
  )
  address: Address;

  @Prop({
    type: String,
    enum: ADType,
    default: ADType.EmptyLand,
    required: true,
  })
  type: ADType;

  @Prop({
    type: String,
    required: true,
    enum: Ownership,
    default: Ownership.Selling,
  })
  ownershipState: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  owner: Types.ObjectId;

  @Prop()
  imgUrls: string[];

  @Prop({ default: false })
  isApproved: boolean;

  @Prop({ default: false })
  ownerSubscriptionExpired: boolean;
}

export const ADSchema = SchemaFactory.createForClass(AD);
