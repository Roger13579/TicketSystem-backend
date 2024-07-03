import { IUser } from '../models/user';

export class LoginVo {
  private account: string;
  private email: string;
  private token: string;
  private refreshToken: string;
  private accountType: string;

  constructor(user: IUser, token: string, refreshToken: string) {
    this.account = user.account;
    this.email = user.email;
    this.token = token;
    this.refreshToken = refreshToken;
    this.accountType = user.accountType;
  }
}
