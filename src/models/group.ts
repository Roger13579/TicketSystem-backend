import { Schema, model } from 'mongoose';
import { ITimestamp } from '../types/common.type';
import { schemaOption } from '../utils/constants';
import { GroupStatus } from '../types/group.type';

interface IGroup extends Document, ITimestamp {
  userId: Schema.Types.ObjectId;
  title: string;
  theater: string;
  movieTitle: string;
  status: GroupStatus;
  time: Date;
  amount: number;
  haveTicket: boolean;
  content: string;
  participant: [object];
}

const schema = new Schema<IGroup>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    theater: {
      type: String,
      required: true,
    },
    movieTitle: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(GroupStatus),
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
  },
  schemaOption,
);

const GroupModel = model<IGroup>('Group', schema);

export default GroupModel;
