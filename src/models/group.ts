import { Schema, model } from 'mongoose';

interface IGroup {
  userId: Schema.Types.ObjectId;
  title: string;
  location: string;
  movieTitle: string;
  status: string;
  time: Date;
  amount: number;
  haveTicket: boolean;
  content: string;
  participant: [object];
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IGroup>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  movieTitle: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  haveTicket: {
    type: Boolean,
    required: true,
  },
  content: {
    type: String,
  },
  participant: {
    type: [
      {
        phone: String,
        name: String,
        nickname: String,
        lineId: String,
      },
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const GroupModel = model<IGroup>('Group', schema);

export default GroupModel;
