import { BaseController } from './baseController';
import { CustomResponseType } from '../types/customResponseType';
import bcrypt from 'bcrypt';
import { LoginVo } from '../vo/loginVo';
import { UserService } from '../service/userService';
import { ResetPwdDto } from '../dto/user/resetPwdDto';
import {
  IForgetPwdReq,
  IGoogleSignUpReq,
  ILoginReq,
  IRefreshTokenReq,
  IResetPwdReq,
  ISignUpReq,
} from '../types/user.type';
import { TMethod } from '../types/common.type';
import { SignUpDTO } from '../dto/user/signUpDto';
import { GoogleSignUpDTO } from '../dto/user/googleSignUpdDto';

class IndexController extends BaseController {
  private readonly userService = new UserService();

  public signUp: TMethod<ISignUpReq> = async (req) => {
    const signUpDto = new SignUpDTO(req);
    await this.userService.createUser(signUpDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
    );
  };
  public googleSignUp: TMethod<IGoogleSignUpReq> = async (req) => {
    const googleSignUpDto = new GoogleSignUpDTO(req);
    await this.userService.updateUserFromGoogle(googleSignUpDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
    );
  };

  public login: TMethod<ILoginReq> = async (req) => {
    const { account, pwd } = req.body;
    const user = await this.userService.findByAccount(account);
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

  public forgotPwd: TMethod<IForgetPwdReq> = async (req) => {
    await this.userService.forgotPwd(req.body.email);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
    );
  };

  public resetPwd: TMethod<IResetPwdReq> = async (req) => {
    const resetPwdDto = new ResetPwdDto(req);
    await this.userService.resetPwd(resetPwdDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
    );
  };

  public refreshToken: TMethod<IRefreshTokenReq> = async (req) => {
    const { refreshToken } = req.body;
    const accessToken = await this.userService.refreshToken(refreshToken);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      { token: accessToken },
    );
  };

  public googleCallback: TMethod = async (req, res, next) => {
    const authUser = await this.userService.googleAuth(req, res, next);
    if (authUser) {
      const { accessToken, refreshToken } = this.userService.generateJWT(
        authUser._id.toString(),
        authUser.accountType.toString(),
      );
      return this.formatResponse(
        CustomResponseType.OK_MESSAGE,
        CustomResponseType.OK,
        {
          specific_redirect_url:
            process.env.MOVIE_GO_URL +
            `?account=${authUser.account}&email=${authUser.email}&token=${accessToken}&refresh_token=${refreshToken}&accountType=${authUser.accountType.toString()}`,
        },
      );
    } else {
      return this.formatResponse(
        CustomResponseType.GOOGLE_AUTH_ERROR_MESSAGE,
        CustomResponseType.GOOGLE_AUTH_ERROR,
        {
          specific_redirect_url: process.env.MOVIE_GO_URL,
        },
      );
    }
  };
}

export default IndexController;
