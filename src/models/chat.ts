import { Schema, model } from 'mongoose';

interface IChat {
  userId: Schema.Types.ObjectId;
  ticketId: Schema.Types.ObjectId;
  groupId: Schema.Types.ObjectId;
  isRead: boolean;
  message: string;
  createdAt: Date;
}

const schema = new Schema<IChat>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ChatModel = model<IChat>('Chat', schema);

export default ChatModel;
