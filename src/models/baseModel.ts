import { Schema, Document } from 'mongoose';

export interface BaseModel extends Document {
  id: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserId {
  userId: Schema.Types.ObjectId;
}

export interface IProductId {
  productId: Schema.Types.ObjectId;
}

export interface IOrderId {
  orderId: Schema.Types.ObjectId;
}

export interface IGroupId {
  groupId: Schema.Types.ObjectId;
}

export interface ITicketId {
  ticketId: Schema.Types.ObjectId;
}

export const schemaDef = {
  cartProduct: {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: String,
    price: Number,
    amount: Number,
  },
  groupId: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  ticketId: {
    type: Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  commentId: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    required: true,
  },
  tagId: {
    type: Schema.Types.ObjectId,
    ref: 'Tag',
    required: true,
  },
  photoPath: {
    type: String,
    trim: true,
    default: '',
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
};
