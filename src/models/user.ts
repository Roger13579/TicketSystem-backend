import mongoose, { Schema, model, Document } from 'mongoose';
import { ITimestamp, Status } from '../types/common.type';
import { schemaOption } from '../utils/constants';
import { AccountType, Gender } from '../types/user.type';

export interface IUser extends Document, ITimestamp {
  account: string;
  pwd: string;
  email: string;
  name: string;
  gender: string;
  avatarPath: string;
  phone: string;
  birthDate: Date;
  address: string;
  thirdPartyId: string;
  thirdPartyType: string;
  isThirdPartyVerified: boolean;
  accountType: AccountType;
  status: Status;
  groups: [Schema.Types.ObjectId];
  collects: [Schema.Types.ObjectId];
  myTickets: [Schema.Types.ObjectId];
}

const schema = new Schema<IUser>(
  {
    account: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    pwd: {
      type: String,
      select: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
      default: '',
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
      default: Gender.none,
    },
    avatarPath: {
      type: String,
      trim: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    birthDate: {
      type: Date,
      default: null,
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    thirdPartyId: {
      type: String,
      trim: true,
    },
    thirdPartyType: {
      type: String,
      trim: true,
    },
    isThirdPartyVerified: {
      type: Boolean,
      default: false,
    },
    accountType: {
      type: String,
      enum: Object.values(AccountType),
      default: AccountType.member,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.active,
    },
    groups: {
      type: [
        {
          groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group',
          },
        },
      ],
    },
    collects: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
          },
        },
      ],
    },
    myTickets: {
      type: [
        {
          ticketId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket',
          },
        },
      ],
    },
  },
  schemaOption,
);

export const UserModel = model<IUser>('User', schema);
