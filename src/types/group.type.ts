import { Types } from 'mongoose';
import { IUserReq } from './common.type';

export enum GroupStatus {
  ongoing = 'ongoing', // 正在揪團
  cancelled = 'cancelled', // 取消揪團
  completed = 'completed', // 完成揪團
}

export interface TCreateGroupReq extends IUserReq {
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

export interface TUpdateGroupReq extends IUserReq {
  body: {
    title: string;
    content?: string;
  };
}

export interface TJoinGroupReq extends IUserReq {
  body: IParticipant;
}

export interface IParticipant {
  phone: string;
  name: string;
  nickname: string;
  lineId: string;
}
