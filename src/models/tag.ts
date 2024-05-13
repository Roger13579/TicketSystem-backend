import { Schema, model } from 'mongoose';
import { schemaOption } from '../utils/constants';
import { BaseModel } from './baseModel';

interface ITag extends BaseModel {
  name: string;
}

const schema = new Schema<ITag>(
  {
    name: {
      type: String,
      required: true,
    },
  },
  schemaOption,
);

const TagModel = model<ITag>('Tag', schema);

export default TagModel;
