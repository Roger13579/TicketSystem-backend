import { Schema, model, Types } from 'mongoose';
import { schemaOption } from '../utils/constants';
import { BaseModel, IUserId, schemaDef } from './baseModel';

interface IChat extends BaseModel, IUserId {
  userId: Types.ObjectId;
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

export const ChatModel = model<IChat>('Chat', schema);
