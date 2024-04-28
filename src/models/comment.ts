import { Schema, model } from 'mongoose';

interface IComment {
  productId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  rating: number;
  content: string;
  createAt: Date;
  updateAt: Date;
  status: boolean;
}

const schema = new Schema<IComment>({
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
  createAt: {
    type: Date,
    default: Date.now
  },
  updateAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: Boolean,
    required: true,
  },
});

const CommentModel = model<IComment>('Comment', schema);

export default CommentModel;
