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
    placeholderImg: string;
    theater: string;
    movieTitle: string;
    time: Date;
    amount: number;
    haveTicket: boolean;
    content?: string;
    participant: IParticipant;
  };
}

export interface TUpdateGroupReq extends IUserReq {
  body: {
    title: string;
    content?: string;
  };
}

export interface IGetGroupsReq extends IUserReq {
  query: {
    title?: string;
    movieTitle?: string;
    theater?: string;
    participantCount?: string;
    status?: string;
    haveTicket?: string;
    startAt?: string;
    endAt?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    accountType?: string;
  };
}

export interface TJoinGroupReq extends IUserReq {
  body: IParticipant;
}

export interface IParticipant {
  userId: Types.ObjectId;
  phone: string;
  name: string;
  nickname: string;
  lineId: string;
}

export enum GroupSortBy {
  startAt = 'startAt',
  title = 'title',
  movieTitle = 'movieTitle',
  theater = 'theater',
  id = 'id',
}
