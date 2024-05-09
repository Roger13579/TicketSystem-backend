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

  constructor(googleUser: any) {
    this.id = googleUser._json.sub;
    this.name = googleUser._json.name;
    this.email = googleUser._json.email;
    this.picture = googleUser._json.picture;
    this.emailVerified = googleUser._json.email_verified;
  }
}
