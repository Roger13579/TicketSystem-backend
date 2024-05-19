import { IParticipant, TJoinGroupReq } from '../../types/group.type';
import { IUser } from '../../models/user';
import { Types } from 'mongoose';

export class JoinGroupDto {
  private readonly _groupId: Types.ObjectId;
  private readonly _userId: Types.ObjectId;
  private readonly _participant: IParticipant;

  get groupId(): Types.ObjectId {
    return this._groupId;
  }

  get userId(): Types.ObjectId {
    return this._userId;
  }

  get participant(): IParticipant {
    return this._participant;
  }

  constructor(req: TJoinGroupReq) {
    this._groupId = new Types.ObjectId(req.params['groupId']);
    const id = (req.user as IUser).id;
    this._userId = id;
    this._participant = req.body;
    this._participant.userId = id;
  }
}
