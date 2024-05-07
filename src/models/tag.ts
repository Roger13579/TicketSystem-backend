import { Schema, model } from 'mongoose';
import { ITimestamp } from '../types/common.type';
import { schemaOption } from '../utils/constants';

interface ITag extends Document, ITimestamp {
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
