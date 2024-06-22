import { Schema, model } from 'mongoose';
import { schemaOption } from '../utils/constants';
import { BaseModel, ModelName, schemaDef } from './baseModel';
import { IUserId } from '../types/user.type';
import { ITicketId } from '../types/ticket.type';

const { ticketId } = schemaDef;

export interface IShareCode extends BaseModel, IUserId, ITicketId {
  shareCode: string;
  expiredAt: Date;
  isUsed: boolean;
}

const schema = new Schema<IShareCode>(
  {
    ticketId,
    expiredAt: {
      type: Date,
      required: true,
    },
    shareCode: {
      type: String,
      required: true,
    },
    isUsed: {
      type: Boolean,
      required: true,
    },
  },
  { ...schemaOption },
);

export const ShareCodeModel = model<IShareCode>(ModelName.shareCode, schema);
