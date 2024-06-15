import { Types } from 'mongoose';
import { IUserReq, TPaginationQuery } from './common.type';
import { IUserId } from './user.type';
import { IGroup } from '../models/group';

export enum GroupStatus {
  ongoing = 'ongoing', // 正在揪團
  cancelled = 'cancelled', // 取消揪團
  completed = 'completed', // 完成揪團
}
export enum GroupType {
  own = 'own', // 是主揪的揪團
  joined = 'joined', // 是參加人的揪團
}

export interface IGroupId {
  groupId: Types.ObjectId;
}

export interface TCreateGroupReq extends IUserReq {
  body: {
    title: string;
    placeholderImg: string;
    theater: string;
    movieTitle: string;
    time: Date;
    amount: number;
    haveTicket: boolean;
    content?: string;
    participant: IParticipant;
  } & IUserId;
}

export interface TUpdateGroupReq extends IUserReq {
  body: {
    title: string;
    content?: string;
  };
}

export interface IGetGroupsReq extends IUserReq {
  query: TPaginationQuery<GroupSortField> & {
    title?: string;
    movieTitle?: string;
    theater?: string;
    participantCount?: string;
    status?: GroupStatus;
    haveTicket?: string;
    startAt?: string;
    endAt?: string;
  };
}

export interface IGetUserGroupsReq extends IUserReq {
  query: TPaginationQuery<GroupSortField> & {
    groupType?: string;
  };
}

export interface IGetUserGroups extends IGroup {
  vacancy: number;
}

export type GroupDocument = Document &
  IGetUserGroups & {
    _id: Types.ObjectId;
  };

export interface TJoinGroupReq extends IUserReq {
  body: IParticipant;
}

export interface IParticipant extends IUserId {
  phone: string;
  name: string;
  nickname: string;
  lineId: string;
}

export enum GroupSortField {
  createdAt = 'createdAt',
  startAt = 'startAt',
  title = 'title',
  movieTitle = 'movieTitle',
  theater = 'theater',
  id = 'id',
}
