import { IUser } from '../models/user';
import { Request } from 'express';

export interface UserReq extends Request {
  user?: IUser | Express.User;
}

export interface ITimestamp {
  createdAt: Date;
  updatedAt: Date;
}

export enum Status {
  active = 'active',
  disabled = 'disabled',
}
