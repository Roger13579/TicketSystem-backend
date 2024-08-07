import { Schema, model } from 'mongoose';
import { Status } from '../types/common.type';
import { schemaOption } from '../utils/constants';
import { AccountType, Gender } from '../types/user.type';
import { BaseModel, ModelName, schemaDef } from './baseModel';
import { ITicketId } from '../types/ticket.type';
import { IGroupId } from '../types/group.type';
import { IProductId } from '../types/product.type';

export interface IUser extends BaseModel {
  account: string;
  pwd: string;
  email: string;
  name: string;
  gender: Gender;
  avatarPath: string;
  phone: string;
  birthDate: Date;
  address: string;
  thirdPartyId?: string;
  thirdPartyType?: string;
  isThirdPartyVerified: boolean;
  accountType: AccountType;
  status: Status;
  groups?: [IGroupId];
  favorites?: [IProductId];
  myTickets?: [ITicketId];
}

const { productId, ticketId, groupId, photoPath } = schemaDef;

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
    avatarPath: photoPath,
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
      type: [{ groupId }],
      default: [],
    },
    favorites: {
      type: [{ productId }],
      default: [],
    },
    myTickets: {
      type: [{ ticketId }],
      default: [],
    },
  },
  schemaOption,
);

export const UserModel = model<IUser>(ModelName.user, schema);
