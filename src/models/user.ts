import { Schema, model } from 'mongoose';

interface IUser {
  account: string;
  googleId: string;
  pwd: string;
  name: string;
  gender: string;
  avatarPath: string;
  email: string;
  phone: string;
  birth: string;
  address: string;
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

const UserModel = model<IUser>('User', schema, 'uuser');

export default UserModel;
