import { Schema, model } from 'mongoose';

interface IUser {
  name: string;
  account: string;
  pwd: string;
  date: Date;
}

const schema = new Schema<IUser>({
  name: { type: String, required: true },
  account: { type: String, required: true },
  pwd: { type: String, required: true },
  date: {
    type: Date,
    default: Date.now,
  },
});

const UserModel = model<IUser>('User', schema);

export default UserModel;
