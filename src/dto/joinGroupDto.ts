import { IParticipant, TJoinGroupReq } from '../types/group.type';
import { IUser } from '../models/user';

export class JoinGroupDto {
  private readonly _groupId: string;
  private readonly _userId: string;
  private readonly _participant: IParticipant;

  get groupId(): string {
    return this._groupId;
  }

  get userId(): string {
    return this._userId;
  }

  get participant(): IParticipant {
    return this._participant;
  }

  constructor(req: TJoinGroupReq) {
    this._groupId = req.params['groupId'];
    this._userId = (req.user as IUser).id.toString();
    this._participant = req.body;
  }
}
