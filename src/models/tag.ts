import { PaginateModel, Schema, model } from 'mongoose';
import { schemaOption } from '../utils/constants';
import { BaseModel, IProductId, ModelName, schemaDef } from './baseModel';
import paginate from 'mongoose-paginate-v2';
import { throwError } from '../utils/errorHandler';
import { CustomResponseType } from '../types/customResponseType';

export interface ITag extends BaseModel {
  name: string;
  usedByProducts: [IProductId];
}

const { productId } = schemaDef;

const schema = new Schema<ITag>(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    usedByProducts: {
      type: [{ productId }],
      select: false,
    },
  },
  schemaOption,
).plugin(paginate);

schema.pre('save', function (this, next) {
  const productIds = this.usedByProducts.map(({ productId }) => productId);

  if (productIds.length !== new Set(productIds).size) {
    throwError(
      CustomResponseType.INSERT_ERROR_MESSAGE,
      CustomResponseType.INSERT_ERROR,
    );
    return next();
  }
  next();
});

const TagModel = model<ITag, PaginateModel<ITag>>(ModelName.tag, schema);

export default TagModel;
