import { PaginateModel, PopulateOptions, Query, Schema, model } from 'mongoose';
import { Status } from '../types/common.type';
import { schemaOption } from '../utils/constants';
import { BaseModel, ModelName, schemaDef } from './baseModel';
import { IProductId } from '../types/product.type';
import { IUserId } from '../types/user.type';

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

schema.pre<Query<unknown, IComment>>(['find', 'findOne'], function (next) {
  const { user } = this.projection();

  const isUserIdShown = !!user._id;
  const populateOptions: PopulateOptions = {
    path: 'userId',
    select: `name ${isUserIdShown ? '' : '-_id'} account avatarPath`,
  };
  this.populate(populateOptions);

  next();
});

const transform = (_doc: unknown, ret: Record<string, unknown>) => {
  ret.user = ret.userId;
  delete ret.userId;
  delete ret.id;
  return ret;
};

schema.set('toJSON', {
  virtuals: true,
  transform,
});

schema.set('toObject', {
  virtuals: true,
  transform,
});

const CommentModel = model<IComment, PaginateModel<IComment>>(
  ModelName.comment,
  schema,
);

export default CommentModel;
