import { ISignUpReq } from '../../types/user.type';

export class SignUpDTO {
  private readonly _email: string;
  private readonly _account: string;
  private readonly _pwd: string;

  get email() {
    return this._email;
  }

  get account() {
    return this._account;
  }
  get pwd() {
    return this._pwd;
  }

  constructor(req: ISignUpReq) {
    const { email, account, pwd } = req.body;
    this._account = account;
    this._email = email;
    this._pwd = pwd;
  }
}
