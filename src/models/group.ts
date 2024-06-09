import { Schema, model, PaginateModel } from 'mongoose';
import { schemaOption } from '../utils/constants';
import { GroupStatus, IParticipant } from '../types/group.type';
import { BaseModel, IUserId, ModelName, schemaDef } from './baseModel';
import paginate from 'mongoose-paginate-v2';

export interface IGroup extends BaseModel, IUserId {
  title: string;
  placeholderImg: string;
  theater: string;
  movieTitle: string;
  status: GroupStatus;
  time: Date;
  amount: number;
  haveTicket: boolean;
  content?: string;
  participant?: [IParticipant];
}

const { userId, photoPath } = schemaDef;

const schema = new Schema<IGroup>(
  {
    userId,
    title: {
      type: String,
      required: true,
    },
    placeholderImg: photoPath,
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
          _id: {
            type: String,
            select: false,
          },
          userId,
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
).plugin(paginate);

export const GroupModel = model<IGroup, PaginateModel<IGroup>>(
  ModelName.group,
  schema,
);
