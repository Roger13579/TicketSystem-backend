import { IUser } from '../../models/user';
import { Request } from 'express';
import { Types } from 'mongoose';

export class LeaveGroupDto {
  private readonly _groupId: Types.ObjectId;
  private readonly _userId: Types.ObjectId;

  get groupId(): Types.ObjectId {
    return this._groupId;
  }

  get userId(): Types.ObjectId {
    return this._userId;
  }

  constructor(req: Request) {
    this._groupId = new Types.ObjectId(req.params['groupId']);
    this._userId = (req.user as IUser).id;
  }
}
