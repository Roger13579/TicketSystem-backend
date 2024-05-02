export class JWTPayloadDTO {
  public readonly id: string;
  public readonly account: string;
  public readonly accountType: string;

  constructor(user: JWTPayloadDTO) {
    this.id = user.id;
    this.account = user.account;
    this.accountType = user.accountType;
  }
}
