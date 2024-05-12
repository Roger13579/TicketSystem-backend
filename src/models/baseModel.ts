import { Schema } from 'mongoose';

export interface BaseModel extends Document {
  id: Schema.Types.ObjectId;
}
