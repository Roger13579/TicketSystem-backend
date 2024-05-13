import { IUser } from '../models/user';
import { IUserReq } from '../types/common.type';

export class JWTPayloadDTO {
  private readonly id: string;
  private readonly _account: string;
  private readonly accountType: string;

  get account() {
    return this._account;
  }

  constructor(req: IUserReq) {
    const { id, account, accountType } = req.user as IUser;
    this.id = id.toString();
    this._account = account;
    this.accountType = accountType;
  }
}
