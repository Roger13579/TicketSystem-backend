import { Schema, model } from 'mongoose';
import { schemaOption } from '../utils/constants';
import { GroupStatus, IParticipant } from '../types/group.type';
import { BaseModel, IUserId, schemaDef } from './baseModel';

export interface IGroup extends BaseModel, IUserId {
  title: string;
  theater: string;
  movieTitle: string;
  status: GroupStatus;
  time: Date;
  amount: number;
  haveTicket: boolean;
  content?: string;
  participant?: [IParticipant];
}

const { userId } = schemaDef;

const schema = new Schema<IGroup>(
  {
    userId,
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
      default: [],
    },
  },
  schemaOption,
);

export const GroupModel = model<IGroup>('Group', schema);
