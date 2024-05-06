import jwt from 'jsonwebtoken';
import { CustomResponseType } from '../types/customResponseType';
import bcrypt from 'bcrypt';
import { UserRepository } from '../repository/userRepository';
import { throwError } from '../utils/errorHandler';
import { UserDetailDto } from '../dto/userDetailDto';
import { IUser } from '../models/user';
import { mailer } from '../utils/mailer';
import log4js from '../config/log4js';
import {ResetPwdDto} from "../dto/resetPwdDto";
const logger = log4js.getLogger(`UserRepository`);

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

  public async findByAccount(account: string): Promise<any> {
    const user = await this.userRepository.findByAccount(account);
    if (!user) {
      throwError(
        CustomResponseType.UNREGISTERED_USER_MESSAGE,
        CustomResponseType.UNREGISTERED_USER,
      );
    }
    return user;
  }

  public async findByEmail(email: string): Promise<any> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throwError(
        CustomResponseType.UNREGISTERED_USER_MESSAGE,
        CustomResponseType.UNREGISTERED_USER,
      );
    }
    return user;
  }

  public async forgotPwd(email: string): Promise<any> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throwError(
        CustomResponseType.EMAIL_VERIFICATION_FAILED_MESSAGE,
        CustomResponseType.EMAIL_VERIFICATION_FAILED,
      );
    } else {
      await mailer(user, await this.generateForgotPasswordJWT(user.id));
    }
  }

  public async resetPwd(resetPwdDto: ResetPwdDto): Promise<any> {
    const user = await this.userRepository.findById(resetPwdDto.getId);
    if (!user) {
      throwError(
          CustomResponseType.EMAIL_VERIFICATION_FAILED_MESSAGE,
          CustomResponseType.EMAIL_VERIFICATION_FAILED,
      );
    } else {
      const dbPwd: string = user.pwd;
      if (resetPwdDto.getOldPwd) {
      let oldCompare = await bcrypt.compare(resetPwdDto.getOldPwd, dbPwd);
        if (!oldCompare) {
          return throwError(
              CustomResponseType.OLD_PASSWORD_INCORRECT_MESSAGE,
              CustomResponseType.OLD_PASSWORD_INCORRECT
          )
        }
      }
      let compare: boolean = await bcrypt.compare(resetPwdDto.getPwd, dbPwd);
      if (compare) {
        return throwError(
            CustomResponseType.CAN_NOT_USE_OLD_PASSWORD_MESSAGE,
            CustomResponseType.CAN_NOT_USE_OLD_PASSWORD
        )
      }
      this.pwdValidate(resetPwdDto.getPwd, resetPwdDto.getConfirmPwd);
      const newPwd = bcrypt.hashSync(resetPwdDto.getPwd, 10);
      return await this.userRepository.updatePwd(resetPwdDto.getId, newPwd)
          .catch(err => {
            logger.error("reset pwd error", err)
            throwError(
                CustomResponseType.UPDATE_ERROR_MESSAGE,
                CustomResponseType.UPDATE_ERROR
            )
          })
    }
  }

  public generateJWT(userId: string, accountType: string): string {
    const privateKey: any = process.env.JWT_SECRETS;
    const defaultOptions: object = {
      expiresIn: process.env.JWT_EXPIRES,
    };
    return jwt.sign(
      { id: userId, accountType: accountType },
      privateKey,
      Object.assign(defaultOptions),
    );
  }

  public async generateForgotPasswordJWT(userId: string): Promise<string> {
    const privateKey: any = process.env.JWT_SECRETS;
    const defaultOptions: object = {
      expiresIn: process.env.JWT_EMAIL_EXPIRES,
    };
    return jwt.sign({ id: userId }, privateKey, Object.assign(defaultOptions));
  }

  private pwdValidate(pwd: string, confirmPwd: string): void {
    if (pwd !== confirmPwd) {
      throwError(
        CustomResponseType.PWD_CONFIRMPWD_NOT_THE_SAME_MESSAGE,
        CustomResponseType.PWD_CONFIRMPWD_NOT_THE_SAME,
      );
    }
  }

  // private async comparePwd(dbPwd: string, pwd: string) {
  //   const compare: boolean = await bcrypt.compare(pwd, dbPwd);
  //   if (compare) {
  //     const jwt: string = this.generateJWT(
  //         user._id.toString(),
  //         user.accountType.toString(),
  //     );
  //     return this.formatResponse(
  //         CustomResponseType.OK_MESSAGE,
  //         CustomResponseType.OK,
  //         new SignUpVo(user, jwt),
  //     );
  //   } else {
  //     return this.formatResponse(
  //         CustomResponseType.WRONG_PASSWORD_MESSAGE,
  //         CustomResponseType.WRONG_PASSWORD,
  //     );
  //   }
  // }
}
