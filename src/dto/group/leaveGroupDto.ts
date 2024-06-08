import { IUser } from '../../models/user';
import { Types } from 'mongoose';
import { IUserReq } from '../../types/common.type';

export class LeaveGroupDto {
  private readonly _groupId: Types.ObjectId;
  private readonly _userId: Types.ObjectId;

  get groupId(): Types.ObjectId {
    return this._groupId;
  }

  get userId(): Types.ObjectId {
    return this._userId;
  }

  constructor(req: IUserReq) {
    this._groupId = new Types.ObjectId(req.params['groupId']);
    this._userId = (req.user as IUser).id;
  }
}
