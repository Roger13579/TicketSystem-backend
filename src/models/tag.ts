import { Schema, model } from 'mongoose';

interface ITag {
  name: string;
}

const schema = new Schema<ITag>({
  name: {
    type: String,
    required: true,
  },
});

const TagModel = model<ITag>('Tag', schema);

export default TagModel;
