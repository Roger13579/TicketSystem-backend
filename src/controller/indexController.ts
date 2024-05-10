import { NextFunction, Request, Response } from 'express';
import { BaseController } from './baseController';
import { ResponseObject } from '../utils/responseObject';
import { CustomResponseType } from '../types/customResponseType';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { LoginVo } from '../vo/loginVo';
import { UserService } from '../service/userService';
import { ResetPwdDto } from '../dto/resetPwdDto';

class IndexController extends BaseController {
  private readonly userService = new UserService();

  public signUp = async (req: Request): Promise<ResponseObject> => {
    this.paramVerify(req);
    const { email, account, pwd, confirmPwd } = req.body;
    await this.userService.createUser(account, email, pwd, confirmPwd);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
    );
  };
  public googleSignUp = async (req: Request): Promise<ResponseObject> => {
    this.paramVerify(req);
    const { account, pwd, confirmPwd } = req.body;
    const thirdPartyId = (req.user as any).thirdPartyId;
    await this.userService.updateUserFromGoogle(
      account,
      pwd,
      confirmPwd,
      thirdPartyId,
    );
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
    );
  };

  public login = async (req: Request): Promise<ResponseObject> => {
    this.paramVerify(req);
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
        new LoginVo(user, jwt),
      );
    } else {
      return this.formatResponse(
        CustomResponseType.WRONG_PASSWORD_MESSAGE,
        CustomResponseType.WRONG_PASSWORD,
      );
    }
  };

  public forgotPwd = async (req: Request): Promise<ResponseObject> => {
    this.paramVerify(req);
    return this.userService.forgotPwd(req.body.email).then(() => {
      return this.formatResponse(
        CustomResponseType.OK_MESSAGE,
        CustomResponseType.OK,
      );
    });
  };

  public resetPwd = async (req: Request): Promise<ResponseObject> => {
    this.paramVerify(req);
    const resetPwdDto = new ResetPwdDto(req);
    return this.userService.resetPwd(resetPwdDto).then(() => {
      return this.formatResponse(
        CustomResponseType.OK_MESSAGE,
        CustomResponseType.OK,
      );
    });
  };

  public googleCallback = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<ResponseObject> => {
    const authUser = await this.userService.googleAuth(req, res, next);
    if (authUser) {
      const jwt = this.userService.generateJWT(
        authUser.id,
        authUser.accountType,
      );
      return this.formatResponse(
        CustomResponseType.OK_MESSAGE,
        CustomResponseType.OK,
        new LoginVo(authUser, jwt),
      );
    } else {
      console.log('authUser is empty');
      return this.formatResponse(
        CustomResponseType.GOOGLE_AUTH_ERROR_MESSAGE,
        CustomResponseType.GOOGLE_AUTH_ERROR,
      );
    }
  };

  private paramVerify(req: Request) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return this.formatResponse(
        result.array()[0].msg,
        CustomResponseType.FORMAT_ERROR,
      );
    }
  }
}

export default IndexController;
