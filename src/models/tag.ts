import { PaginateModel, Schema, model } from 'mongoose';
import { schemaOption, virtualSchemaOption } from '../utils/constants';
import { BaseModel, ModelName } from './baseModel';
import paginate from 'mongoose-paginate-v2';

export interface ITag extends BaseModel {
  name: string;
}

const schema = new Schema<ITag>(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
  },
  { ...schemaOption, ...virtualSchemaOption },
).plugin(paginate);

const TagModel = model<ITag, PaginateModel<ITag>>(ModelName.tag, schema);

export default TagModel;
