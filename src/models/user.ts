import mongoose, { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
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
  accountType: string;
  status: string;
  groups: [Schema.Types.ObjectId];
  collects: [Schema.Types.ObjectId];
  myTickets: [Schema.Types.ObjectId];
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IUser>({
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
    enum: ['male', 'female', 'none'],
    default: 'none',
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
    enum: ['admin', 'member'],
  },
  status: {
    type: String,
    enum: ['active', 'disabled'],
    default: 'active',
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const UserModel = model<IUser>('User', schema);
