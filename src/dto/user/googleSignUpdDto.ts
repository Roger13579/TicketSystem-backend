import { IUser } from '../../models/user';
import { IGoogleSignUpReq } from '../../types/user.type';

export class GoogleSignUpDTO {
  private _account: string;
  private _pwd: string;
  private _thirdPartyId: string;

  get account() {
    return this._account;
  }

  get pwd() {
    return this._pwd;
  }

  get thirdPartyId() {
    return this._thirdPartyId;
  }

  constructor(req: IGoogleSignUpReq) {
    const { body, user } = req;
    const { account, pwd } = body;
    this._account = account;
    this._pwd = pwd;
    this._thirdPartyId = (user as IUser).thirdPartyId as string;
  }
}
