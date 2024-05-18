import { TGoogleUser } from '../../types/user.type';

export class GoogleProfileDto {
  private readonly id: string;
  private readonly name: string;
  private readonly email: string;
  private readonly picture: string;
  private readonly emailVerified: boolean;

  get getId(): string {
    return this.id;
  }
  get getName(): string {
    return this.name;
  }
  get getEmail(): string {
    return this.email;
  }
  get getPicture(): string {
    return this.picture;
  }
  get getEmailVerified(): boolean {
    return this.emailVerified;
  }

  constructor(googleUser: TGoogleUser) {
    const { sub, name, email, picture, email_verified } = googleUser._json;
    this.id = sub;
    this.name = name;
    this.email = email;
    this.picture = picture;
    this.emailVerified = email_verified;
  }
}
