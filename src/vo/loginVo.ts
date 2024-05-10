import mongoose from 'mongoose';

export class LoginVo {
  private account: string;
  private email: string;
  private token: string;
  private accountType: string;

  constructor(user: mongoose.Document, token: string) {
    this.account = user.get('account');
    this.email = user.get('email');
    this.token = token;
    this.accountType = user.get('accountType');
  }
}
