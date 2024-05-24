import { NextFunction, Request, Response } from 'express';
import { BaseController } from './baseController';
import { ResponseObject } from '../utils/responseObject';
import { CustomResponseType } from '../types/customResponseType';
import bcrypt from 'bcrypt';
import { LoginVo } from '../vo/loginVo';
import { UserService } from '../service/userService';
import { ResetPwdDto } from '../dto/user/resetPwdDto';
import { IUser } from '../models/user';
import { ILoginReq, IRefreshTokenReq } from '../types/user.type';

class IndexController extends BaseController {
  private readonly userService = new UserService();

  public signUp = async (req: Request): Promise<ResponseObject> => {
    const { email, account, pwd, confirmPwd } = req.body;
    await this.userService.createUser(account, email, pwd, confirmPwd);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
    );
  };
  public googleSignUp = async (req: Request): Promise<ResponseObject> => {
    const { account, pwd, confirmPwd } = req.body;
    const thirdPartyId = (req.user as IUser).thirdPartyId as string;
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

  public login = async (req: ILoginReq): Promise<ResponseObject> => {
    const account = req.body.account;
    const pwd = req.body.pwd;
    const user = (await this.userService.findByAccount(account)) as IUser;
    const dbPwd = user.pwd;
    const compare = await bcrypt.compare(pwd, dbPwd);
    if (compare) {
      const { accessToken, refreshToken } = this.userService.generateJWT(
        user._id.toString(),
        user.accountType.toString(),
      );
      return this.formatResponse(
        CustomResponseType.OK_MESSAGE,
        CustomResponseType.OK,
        new LoginVo(user, accessToken, refreshToken),
      );
    } else {
      return this.formatResponse(
        CustomResponseType.WRONG_PASSWORD_MESSAGE,
        CustomResponseType.WRONG_PASSWORD,
      );
    }
  };

  public forgotPwd = async (req: Request): Promise<ResponseObject> => {
    return this.userService.forgotPwd(req.body.email).then(() => {
      return this.formatResponse(
        CustomResponseType.OK_MESSAGE,
        CustomResponseType.OK,
      );
    });
  };

  public resetPwd = async (req: Request): Promise<ResponseObject> => {
    const resetPwdDto = new ResetPwdDto(req);
    return this.userService.resetPwd(resetPwdDto).then(() => {
      return this.formatResponse(
        CustomResponseType.OK_MESSAGE,
        CustomResponseType.OK,
      );
    });
  };

  public refreshToken = async (
    req: IRefreshTokenReq,
  ): Promise<ResponseObject> => {
    const token = req.body.refreshToken;
    const accessToken = await this.userService.refreshToken(token);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      { token: accessToken },
    );
  };

  public googleCallback = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<ResponseObject> => {
    const authUser = await this.userService.googleAuth(req, res, next);
    if (authUser) {
      const { accessToken, refreshToken } = this.userService.generateJWT(
        authUser._id.toString(),
        authUser.accountType.toString(),
      );
      return this.formatResponse(
        CustomResponseType.OK_MESSAGE,
        CustomResponseType.OK,
        new LoginVo(authUser, accessToken, refreshToken),
      );
    } else {
      return this.formatResponse(
        CustomResponseType.GOOGLE_AUTH_ERROR_MESSAGE,
        CustomResponseType.GOOGLE_AUTH_ERROR,
      );
    }
  };
}

export default IndexController;
