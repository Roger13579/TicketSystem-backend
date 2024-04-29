import { Request } from 'express';
import { validationResult } from 'express-validator';
import { BaseController } from './baseController';
import log4js from '../config/log4js';
import { CustomResponseType } from '../types/customResponseType';
import { ResponseObject } from '../utils/responseObject';
import { UserService } from '../service/user.service';
import bcrypt from 'bcrypt';
import { SignUpVo } from '../vo/signUpVo';

const logger = log4js.getLogger(`UserController`);

class UserController extends BaseController {
  private readonly userService = new UserService();

  public createUser = async (req: Request): Promise<ResponseObject> => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return this.formatResponse(
        result.array()[0].msg,
        CustomResponseType.FORMAT_ERROR,
      );
    }
    const { email, account, pwd, confirmPwd } = req.body;
    const newUser = await this.userService.createUser(
      account,
      email,
      pwd,
      confirmPwd,
    );
    if (!newUser) {
      logger.error('create user error');
      return this.formatResponse(
        CustomResponseType.INSERT_ERROR_MESSAGE,
        CustomResponseType.INSERT_ERROR,
      );
    }
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
    );
  };

  public login = async (req: Request): Promise<ResponseObject> => {
    const account: string = req.body.account;
    const pwd: string = req.body.pwd;
    const user = await this.userService.findByAccount(account);
    if (!user) {
      return this.formatResponse(
        CustomResponseType.UNREGISTERED_USER_MESSAGE,
        CustomResponseType.UNREGISTERED_USER,
      );
    }
    const dbPwd: string = user.pwd;
    const compare: boolean = await bcrypt.compare(pwd, dbPwd);
    if (compare) {
      const jwt: string = await this.userService.generateJWT(
        user._id.toString(),
        user.accountType.toString(),
      );
      return this.formatResponse(
        new SignUpVo(user, jwt),
        CustomResponseType.OK,
      );
    } else {
      return this.formatResponse(
        CustomResponseType.WRONG_PASSWORD_MESSAGE,
        CustomResponseType.WRONG_PASSWORD,
      );
    }
  };
}

export default UserController;
