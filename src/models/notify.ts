import { Schema, model } from 'mongoose';
import { ITimestamp } from '../types/common.type';
import { schemaOption } from '../utils/constants';

interface INotify extends Document, ITimestamp {
  userId: Schema.Types.ObjectId;
  isRead: boolean;
  content: string;
}

const schema = new Schema<INotify>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      trim: true,
    },
  },
  schemaOption,
);

const NotifyModel = model<INotify>('Notify', schema);

export default NotifyModel;
