import { Schema, model, Types } from 'mongoose';
import { schemaOption } from '../utils/constants';
import { BaseModel, IUserId, ModelName, schemaDef } from './baseModel';

interface IChat extends BaseModel, IUserId {
  ticketId?: Types.ObjectId;
  groupId?: Types.ObjectId;
  isRead: boolean;
  message: string;
}

const { userId } = schemaDef;

const schema = new Schema<IChat>(
  {
    userId,
    ticketId: {
      type: Schema.Types.ObjectId,
      ref: 'Ticket',
    },
    groupId: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
    },
    isRead: {
      type: Boolean,
      required: true,
    },
    message: {
      type: String,
      trim: true,
      required: true,
    },
  },
  schemaOption,
);

export const ChatModel = model<IChat>(ModelName.chat, schema);
