import jwt, { JwtPayload } from 'jsonwebtoken';
import { CustomResponseType } from '../types/customResponseType';
import bcrypt from 'bcrypt';
import { UserRepository } from '../repository/userRepository';
import { throwError } from '../utils/errorHandler';
import { UserDetailDto } from '../dto/user/userDetailDto';
import { IUser } from '../models/user';
import { mailer } from '../utils/mailer';
import log4js from '../config/log4js';
import { ResetPwdDto } from '../dto/user/resetPwdDto';
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { GoogleProfileDto } from '../dto/user/googleProfileDto';
import { TGoogleUser } from '../types/user.type';
const logger = log4js.getLogger(`UserService`);

export class UserService {
  private readonly userRepository: UserRepository = new UserRepository();

  public async createUser(
    account: string,
    email: string,
    pwd: string,
    confirmPwd: string,
  ): Promise<IUser | void> {
    this.pwdValidate(pwd, confirmPwd);
    const hashPwd = bcrypt.hashSync(pwd, 10);
    const findByEmail = await this.userRepository.findByEmail(email);
    const findByAccount = await this.userRepository.findByAccount(account);
    if (findByEmail) {
      throwError(
        CustomResponseType.EMAIL_REGISTERED_MESSAGE + email,
        CustomResponseType.EMAIL_REGISTERED,
      );
    } else if (findByAccount) {
      throwError(
        CustomResponseType.ACCOUNT_REGISTERED_MESSAGE + account,
        CustomResponseType.ACCOUNT_REGISTERED,
      );
    }
    return this.userRepository
      .createUser(account, email, hashPwd)
      .catch((err) => {
        logger.error('create user error', err);
        throwError(
          CustomResponseType.INSERT_ERROR_MESSAGE,
          CustomResponseType.INSERT_ERROR,
        );
      });
  }

  public async updateUserDetail(
    userDetailDto: UserDetailDto,
  ): Promise<IUser | null | void> {
    return this.userRepository.updateUserDetail(userDetailDto).catch((err) => {
      logger.error('update user detail error', err);
      throwError(
        CustomResponseType.UPDATE_ERROR_MESSAGE,
        CustomResponseType.UPDATE_ERROR,
      );
    });
  }

  public async updateUserFromGoogle(
    account: string,
    pwd: string,
    confirmPwd: string,
    thirdPartyId: string,
  ): Promise<IUser | null | void> {
    this.pwdValidate(pwd, confirmPwd);
    const hashPwd = bcrypt.hashSync(pwd, 10);
    return this.userRepository
      .updateUserFromGoogle(account, hashPwd, thirdPartyId)
      .catch((err) => {
        logger.error('update google user detail error', err);
        throwError(
          CustomResponseType.UPDATE_ERROR_MESSAGE,
          CustomResponseType.UPDATE_ERROR,
        );
      });
  }

  public async findByAccount(account: string): Promise<unknown> {
    const user = await this.userRepository.findByAccount(account);
    if (!user) {
      throwError(
        CustomResponseType.UNREGISTERED_USER_MESSAGE,
        CustomResponseType.UNREGISTERED_USER,
      );
    }
    return user;
  }

  public async findByEmail(email: string): Promise<unknown> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throwError(
        CustomResponseType.UNREGISTERED_USER_MESSAGE,
        CustomResponseType.UNREGISTERED_USER,
      );
    }
    return user;
  }

  public async forgotPwd(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throwError(
        CustomResponseType.EMAIL_VERIFICATION_FAILED_MESSAGE,
        CustomResponseType.EMAIL_VERIFICATION_FAILED,
      );
    } else {
      await mailer(
        user,
        await this.generateForgotPasswordJWT(user.id.toString()),
      );
    }
  }
  public async refreshToken(token: string): Promise<string | undefined> {
    let payload: jwt.JwtPayload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRETS) as JwtPayload;
      const user = await this.userRepository.findById(payload.id);
      if (user) {
        return jwt.sign(
          { id: user.id.toString(), accountType: user.accountType },
          process.env.JWT_SECRETS,
          Object.assign({ expiresIn: process.env.JWT_EXPIRES }),
        );
      } else {
        throw new Error();
      }
    } catch (err) {
      throwError(
        CustomResponseType.TOKEN_EXPIRED_MESSAGE,
        CustomResponseType.TOKEN_EXPIRED,
      );
    }
  }

  public async resetPwd(resetPwdDto: ResetPwdDto): Promise<unknown> {
    const user = await this.userRepository.findById(resetPwdDto.getId);
    if (!user) {
      throwError(
        CustomResponseType.EMAIL_VERIFICATION_FAILED_MESSAGE,
        CustomResponseType.EMAIL_VERIFICATION_FAILED,
      );
    } else {
      const dbPwd: string = user.pwd;
      if (resetPwdDto.getOldPwd) {
        const oldCompare = await bcrypt.compare(resetPwdDto.getOldPwd, dbPwd);
        if (!oldCompare) {
          return throwError(
            CustomResponseType.OLD_PASSWORD_INCORRECT_MESSAGE,
            CustomResponseType.OLD_PASSWORD_INCORRECT,
          );
        }
      }
      const compare: boolean = await bcrypt.compare(resetPwdDto.getPwd, dbPwd);
      if (compare) {
        return throwError(
          CustomResponseType.CAN_NOT_USE_OLD_PASSWORD_MESSAGE,
          CustomResponseType.CAN_NOT_USE_OLD_PASSWORD,
        );
      }
      this.pwdValidate(resetPwdDto.getPwd, resetPwdDto.getConfirmPwd);
      const newPwd = bcrypt.hashSync(resetPwdDto.getPwd, 10);
      return await this.userRepository
        .updatePwd(resetPwdDto.getId, newPwd)
        .catch((err) => {
          logger.error('reset pwd error', err);
          throwError(
            CustomResponseType.UPDATE_ERROR_MESSAGE,
            CustomResponseType.UPDATE_ERROR,
          );
        });
    }
  }

  public generateJWT(
    userId: string,
    accountType: string,
  ): { accessToken: string; refreshToken: string } {
    const privateKey = process.env.JWT_SECRETS;
    const defaultOptions: object = {
      expiresIn: process.env.JWT_EXPIRES,
    };
    const refreshOptions: object = {
      expiresIn: process.env.JWT_REFRESH_EXPIRES,
    };
    const accessToken = jwt.sign(
      { id: userId, accountType: accountType },
      privateKey,
      Object.assign(defaultOptions),
    );

    const refreshToken = jwt.sign(
      { id: userId, accountType: accountType },
      privateKey,
      Object.assign(refreshOptions),
    );
    return { accessToken, refreshToken };
  }
  public generateRefreshJWT(userId: string, accountType: string): string {
    const privateKey = process.env.JWT_SECRETS;
    const defaultOptions: object = {
      expiresIn: process.env.JWT_REFRESH_EXPIRES,
    };
    return jwt.sign(
      { id: userId, accountType: accountType },
      privateKey,
      Object.assign(defaultOptions),
    );
  }

  public async generateForgotPasswordJWT(userId: string): Promise<string> {
    const privateKey = process.env.JWT_SECRETS;
    const defaultOptions: object = {
      expiresIn: process.env.JWT_EMAIL_EXPIRES,
    };
    return jwt.sign({ id: userId }, privateKey, Object.assign(defaultOptions));
  }

  public async googleAuth(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<IUser | void> {
    const authenticate = (): Promise<GoogleProfileDto> =>
      new Promise((resolve, _reject) => {
        passport.authenticate(
          'google',
          { session: false },
          (error: Error, user: TGoogleUser) => {
            if (error || !user) {
              logger.error(error);
              throwError(
                CustomResponseType.GOOGLE_AUTH_ERROR_MESSAGE,
                CustomResponseType.GOOGLE_AUTH_ERROR,
              );
            }
            resolve(new GoogleProfileDto(user));
          },
        )(req, res, next);
      });

    const googleUser: GoogleProfileDto = await authenticate();
    const user = await this.userRepository.findByThirdPartyId(googleUser.getId);
    if (!user) {
      return this.userRepository.createUserByGoogle(googleUser).catch((err) => {
        logger.error('create user error', err);
        throwError(
          CustomResponseType.INSERT_ERROR_MESSAGE,
          CustomResponseType.INSERT_ERROR,
        );
      });
    } else {
      return user;
    }
  }

  private pwdValidate(pwd: string, confirmPwd: string): void {
    if (pwd !== confirmPwd) {
      throwError(
        CustomResponseType.PWD_CONFIRMED_NOT_THE_SAME_MESSAGE,
        CustomResponseType.PWD_CONFIRMED_NOT_THE_SAME,
      );
    }
  }
}
