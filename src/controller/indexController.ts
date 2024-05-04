import { Request } from 'express';
import { BaseController } from './baseController';
import { ResponseObject } from '../utils/responseObject';
import { CustomResponseType } from '../types/customResponseType';
import {validationResult} from "express-validator";
import bcrypt from "bcrypt";
import {SignUpVo} from "../vo/signUpVo";
import {UserService} from "../service/user.service";

class IndexController extends BaseController {
  private readonly userService = new UserService();

  public signIn = async (req: Request): Promise<ResponseObject> => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return this.formatResponse(
          result.array()[0].msg,
          CustomResponseType.FORMAT_ERROR,
      );
    }
    const { email, account, pwd, confirmPwd } = req.body;
    await this.userService.createUser(
        account,
        email,
        pwd,
        confirmPwd,
    );
    return this.formatResponse(
        CustomResponseType.OK_MESSAGE,
        CustomResponseType.OK,
    );
  };

  public login = async (req: Request): Promise<ResponseObject> => {
    const account: string = req.body.account;
    const pwd: string = req.body.pwd;
    const user = await this.userService.findByAccount(account);
    const dbPwd: string = user.pwd;
    const compare: boolean = await bcrypt.compare(pwd, dbPwd);
    if (compare) {
      const jwt: string = this.userService.generateJWT(
          user._id.toString(),
          user.accountType.toString(),
      );
      return this.formatResponse(
          CustomResponseType.OK_MESSAGE,
          CustomResponseType.OK,
          new SignUpVo(user, jwt),
      );
    } else {
      return this.formatResponse(
          CustomResponseType.WRONG_PASSWORD_MESSAGE,
          CustomResponseType.WRONG_PASSWORD,
      );
    }
  };
}

export default IndexController;
