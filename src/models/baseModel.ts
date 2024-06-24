import { Document, Schema, Types } from 'mongoose';
import { ITimestamp } from '../types/common.type';

export enum ModelName {
  cart = 'Cart',
  ticket = 'Ticket',
  group = 'Group',
  product = 'Product',
  user = 'User',
  comment = 'Comment',
  tag = 'Tag',
  order = 'Order',
  chat = 'Chat',
  notify = 'Notify',
  shareCode = 'ShareCode',
}

export interface BaseModel extends Document, ITimestamp {
  id: Types.ObjectId;
}

export const schemaDef = {
  groupId: {
    type: Schema.Types.ObjectId,
    ref: ModelName.group,
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: ModelName.product,
    required: true,
  },
  ticketId: {
    type: Schema.Types.ObjectId,
    ref: ModelName.ticket,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: ModelName.user,
    required: true,
  },
  commentId: {
    type: Schema.Types.ObjectId,
    ref: ModelName.comment,
    required: true,
  },
  tagId: {
    type: Schema.Types.ObjectId,
    ref: ModelName.tag,
    required: true,
  },
  photoPath: {
    type: String,
    trim: true,
    default: '',
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: ModelName.order,
    required: true,
  },
  plan: {
    type: {
      name: {
        type: String,
        trim: true,
        required: true,
      },
      discount: {
        type: Number,
        max: 1,
        min: 0.1,
        required: true,
      },
      headCount: {
        type: Number,
        min: 1,
        required: true,
      },
    },
    required: true,
  },
};

export const productSnapshotSchemaDef = {
  title: {
    type: String,
    required: true,
    trim: true,
  },
  brief: {
    type: String,
    required: true,
    trim: true,
    default: '',
  },
  type: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  vendor: {
    type: String,
    required: true,
    trim: true,
  },
  theater: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 100,
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
  },
  startAt: {
    type: Date,
    required: true,
  },
};
