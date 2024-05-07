import { Schema, model } from 'mongoose';
import { ITimestamp, Status } from '../types/common.type';
import { schemaOption } from '../utils/constants';

interface IComment extends Document, ITimestamp {
  productId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  rating: number;
  content: string;
  status: Status;
}

const schema = new Schema<IComment>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
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

const CommentModel = model<IComment>('Comment', schema);

export default CommentModel;
