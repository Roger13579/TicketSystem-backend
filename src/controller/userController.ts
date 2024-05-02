import { Request } from 'express';
import { validationResult } from 'express-validator';
import { BaseController } from './baseController';
import log4js from '../config/log4js';
import { CustomResponseType } from '../types/customResponseType';
import { ResponseObject } from '../utils/responseObject';
import { UserService } from '../service/user.service';
import bcrypt from 'bcrypt';
import { SignUpVo } from '../vo/signUpVo';
import { JWTPayloadDTO } from '../dto/jwtPayloadDto';
import { UserDetailVo } from '../vo/userDetailVo';
import { UserDetailDto } from '../dto/userDetailDto';

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

  public getUserDetail = async (req: Request): Promise<ResponseObject> => {
    const payload = new JWTPayloadDTO((req as any).user);
    const user = await this.userService.findByAccount(payload.account);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      new UserDetailVo(user),
    );
  };

  public updateUserDetail = async (req: Request): Promise<ResponseObject> => {
    const userDetailDto = new UserDetailDto(req);
    await this.userService.updateUserDetail(userDetailDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
    );
  };
}

export default UserController;
