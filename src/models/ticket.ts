import { Schema, model, PaginateModel } from 'mongoose';
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
  writeOffStaffId?: IUserId;
  shareCode?: string;
}

const { productId, userId, orderId } = schemaDef;

const schema = new Schema<ITicket>(
  {
    productId,
    userId,
    orderId,
    // 如果是多人套票的話，這個數字就不是 1
    // 每張票在核銷時，一定都只一次把所有 amount 的票券核銷完，不能一張一張核銷
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
    writeOffStaffId: userId,
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
