import { IUser } from '../../models/user';
import { IResetPwdReq } from '../../types/user.type';

export class ResetPwdDto {
  private readonly id: string;
  private readonly oldPwd: string;
  private readonly pwd: string;
  get getId(): string {
    return this.id;
  }
  get getOldPwd(): string {
    return this.oldPwd;
  }
  get getPwd(): string {
    return this.pwd;
  }

  constructor(req: IResetPwdReq) {
    this.id = (req.user as IUser).id.toString();
    const { oldPwd, pwd } = req.body;
    this.oldPwd = oldPwd;
    this.pwd = pwd;
  }
}
