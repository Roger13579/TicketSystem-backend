import { Schema, model, PaginateModel, Types } from 'mongoose';
import { schemaOption, virtualSchemaOption } from '../utils/constants';
import { TicketStatus } from '../types/ticket.type';
import { BaseModel, ModelName, schemaDef } from './baseModel';
import paginate from 'mongoose-paginate-v2';
import { IOrderId } from '../types/order.type';
import { IProductId } from '../types/product.type';
import { IUserId } from '../types/user.type';

const { productId, userId, orderId } = schemaDef;

export interface ITicket extends BaseModel, IUserId, IProductId, IOrderId {
  status: TicketStatus;
  isPublished: boolean;
  chatRoomId: string;
  expiredAt?: Date;
  writeOffAt?: Date;
  writeOffStaffId?: Types.ObjectId;
  shareCode?: string;
  giverId?: Types.ObjectId;
}

const schema = new Schema<ITicket>(
  {
    productId,
    userId, // 目前票券的擁有者
    orderId,
    giverId: {
      type: Schema.Types.ObjectId,
      ref: ModelName.product,
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
    chatRoomId: { type: String },
    writeOffAt: {
      type: Date,
      select: true,
    },
    writeOffStaffId: userId,
    shareCode: { type: String },
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
