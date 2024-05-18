import { Schema, model } from 'mongoose';
import { Status } from '../types/common.type';
import { schemaOption } from '../utils/constants';
import {
  BaseModel,
  IProductId,
  IUserId,
  ModelName,
  schemaDef,
} from './baseModel';

export interface IComment extends BaseModel, IProductId, IUserId {
  rating: number;
  content: string;
  status: Status;
}

const { productId, userId } = schemaDef;

const schema = new Schema<IComment>(
  {
    productId,
    userId,
    rating: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      required: true,
    },
  },
  schemaOption,
);

const CommentModel = model<IComment>(ModelName.comment, schema);

export default CommentModel;
