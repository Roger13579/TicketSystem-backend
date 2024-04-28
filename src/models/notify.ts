import { Schema, model } from 'mongoose';

interface INotify {
  userId: Schema.Types.ObjectId;
  isRead: boolean;
  content: string;
}

const schema = new Schema<INotify>({
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
});

const NotifyModel = model<INotify>('Notify', schema);

export default NotifyModel;
