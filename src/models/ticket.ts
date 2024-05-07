import { Schema, model } from 'mongoose';
import { ITimestamp } from '../types/common.type';
import { schemaOption } from '../utils/constants';
import { TicketStatus } from '../types/ticket.type';

interface ITicket extends Document, ITimestamp {
  userId: Schema.Types.ObjectId;
  orderId: Schema.Types.ObjectId;
  productId: Schema.Types.ObjectId;
  amount: number;
  status: TicketStatus;
  isPublished: boolean;
  chatRoomId: string;
  writeOffAt: Date;
  writeOffStaff: Date;
  shareCode: string;
}

const schema = new Schema<ITicket>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
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
