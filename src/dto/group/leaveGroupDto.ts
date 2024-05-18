import { IUser } from '../../models/user';
import { Request } from 'express';

export class LeaveGroupDto {
  private readonly _groupId: string;
  private readonly _userId: string;

  get groupId(): string {
    return this._groupId;
  }

  get userId(): string {
    return this._userId;
  }

  constructor(req: Request) {
    this._groupId = req.params['groupId'];
    this._userId = (req.user as IUser).id.toString();
  }
}
