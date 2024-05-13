import { Schema, model } from 'mongoose';
import { schemaOption } from '../utils/constants';
import { TicketStatus } from '../types/ticket.type';
import {
  BaseModel,
  IOrderId,
  IProductId,
  IUserId,
  schemaDef,
} from './baseModel';

interface ITicket extends BaseModel, IUserId, IProductId, IOrderId {
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
      required: true,
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
);

const TicketModel = model<ITicket>('Ticket', schema);

export default TicketModel;
