import { Document, Schema, Types } from 'mongoose';

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
}

export interface BaseModel extends Document {
  id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserId {
  userId: Types.ObjectId;
}

export interface IProductId {
  productId: Types.ObjectId;
}

export interface IOrderId {
  orderId: Types.ObjectId;
}

export interface IGroupId {
  groupId: Types.ObjectId;
}

export interface ITicketId {
  ticketId: Types.ObjectId;
}

export const schemaDef = {
  cartProduct: {
    productId: {
      type: Schema.Types.ObjectId,
      ref: ModelName.product,
      required: true,
    },
    name: String,
    price: Number,
    amount: Number,
  },
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
};
