import { Request } from 'express';
import { Types } from 'mongoose';

export enum GroupStatus {
  ongoing = 'ongoing', // 正在揪團
  cancelled = 'cancelled', // 取消揪團
  completed = 'completed', // 完成揪團
}

export interface TCreateGroupReq extends Request {
  body: {
    userId: Types.ObjectId;
    title: string;
    theater: string;
    movieTitle: string;
    time: Date;
    amount: number;
    haveTicket: boolean;
    content?: string;
  };
}
