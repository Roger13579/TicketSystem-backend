import { Schema, model } from 'mongoose';

interface ITicket {
  userId: Schema.Types.ObjectId;
  orderId: Schema.Types.ObjectId;
  productId: Schema.Types.ObjectId;
  amount: number;
  status: string;
  isPublished: boolean;
  chatRoomId: string;
  writeOffAt: Date;
  writeOffStaff: Date;
  shareCode: string;
}

const schema = new Schema<ITicket>({
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
});

const TicketModel = model<ITicket>('Ticekt', schema);

export default TicketModel;
