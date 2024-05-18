import { Schema, model } from 'mongoose';
import { schemaOption } from '../utils/constants';
import { BaseModel, IUserId, ModelName, schemaDef } from './baseModel';

interface INotify extends BaseModel, IUserId {
  isRead: boolean;
  content: string;
}

const { userId } = schemaDef;

const schema = new Schema<INotify>(
  {
    userId,
    isRead: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      trim: true,
      required: true,
    },
  },
  schemaOption,
);

const NotifyModel = model<INotify>(ModelName.notify, schema);

export default NotifyModel;
