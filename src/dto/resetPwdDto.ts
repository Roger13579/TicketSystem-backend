import { IUser } from '../models/user';
import { IResetPwdReq } from '../types/user.type';

export class ResetPwdDto {
  private readonly id: string;
  private readonly oldPwd: string;
  private readonly pwd: string;
  private readonly confirmPwd: string;

  get getId(): string {
    return this.id;
  }
  get getOldPwd(): string {
    return this.oldPwd;
  }
  get getPwd(): string {
    return this.pwd;
  }
  get getConfirmPwd(): string {
    return this.confirmPwd;
  }

  constructor(req: IResetPwdReq) {
    this.id = (req.user as IUser).id;
    const { oldPwd, pwd, confirmPwd } = req.body;
    this.oldPwd = oldPwd;
    this.pwd = pwd;
    this.confirmPwd = confirmPwd;
  }
}
