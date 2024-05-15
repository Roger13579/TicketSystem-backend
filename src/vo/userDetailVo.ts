import mongoose from 'mongoose';

export class UserDetailVo {
  private name: string;
  private createdAt: Date;
  private birthDate: string;
  private email: string;
  private gender: string;
  private phone: string;
  private address: string;
  private imgUrl: string;

  constructor(user: mongoose.Document) {
    this.name = user.get('name');
    this.createdAt = user.get('createdAt');
    this.birthDate = user.get('birthDate');
    this.email = user.get('email');
    this.gender = user.get('gender');
    this.phone = user.get('phone');
    this.address = user.get('address');
    this.imgUrl = user.get('avatarPath');
  }
}
