import mongoose from 'mongoose';

export class LoginVo {
  private account: string;
  private email: string;
  private token: string;
  private refreshToken: string;
  private accountType: string;

  constructor(user: mongoose.Document, token: string, refreshToken: string) {
    this.account = user.get('account');
    this.email = user.get('email');
    this.token = token;
    this.refreshToken = refreshToken;
    this.accountType = user.get('accountType');
  }
}
