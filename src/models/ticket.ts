import { Schema, model, PaginateModel } from 'mongoose';
import { schemaOption } from '../utils/constants';
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
import { IOrder } from './order';

export interface ITicket extends BaseModel, IUserId, IProductId, IOrderId {
  amount: number;
  status: TicketStatus;
  isPublished: boolean;
  chatRoomId: string;
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
    chatRoomId: {
      type: String,
    },
    writeOffAt: {
      type: Date,
    },
    writeOffStaff: {
      type: Date,
    },
    shareCode: {
      type: String,
    },
  },
  schemaOption,
).plugin(paginate);

export const TicketModel = model<ITicket, PaginateModel<IOrder>>(
  ModelName.ticket,
  schema,
);
