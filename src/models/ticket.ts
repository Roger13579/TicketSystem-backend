import { Schema, model, PaginateModel, Query, PopulateOptions } from 'mongoose';
import { schemaOption, virtualSchemaOption } from '../utils/constants';
import { TicketStatus } from '../types/ticket.type';
import {
  BaseModel,
  IOrderId,
  IProductId,
  IUserId,
  ModelName,
  schemaDef,
} from './baseModel';
import paginate from 'mongoose-paginate-v2';

export interface ITicket extends BaseModel, IUserId, IProductId, IOrderId {
  amount: number;
  status: TicketStatus;
  isPublished: boolean;
  chatRoomId: string;
  expiredAt?: Date;
  writeOffAt?: Date;
  writeOffStaff?: Date;
  shareCode?: string;
}

const { productId, userId, orderId } = schemaDef;

const schema = new Schema<ITicket>(
  {
    productId,
    userId,
    orderId,
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TicketStatus),
      required: true,
    },
    isPublished: {
      type: Boolean,
      required: true,
    },
    expiredAt: {
      type: Date,
      required: true,
    },
    chatRoomId: {
      type: String,
    },
    writeOffAt: {
      type: Date,
      select: true,
    },
    writeOffStaff: {
      type: String,
      select: true,
    },
    shareCode: {
      type: String,
    },
  },
  { ...schemaOption, ...virtualSchemaOption },
).plugin(paginate);
schema.virtual('product', {
  ref: 'Product',
  localField: 'productId',
  foreignField: '_id',
  justOne: true,
});

export const TicketModel = model<ITicket, PaginateModel<ITicket>>(
  ModelName.ticket,
  schema,
);
