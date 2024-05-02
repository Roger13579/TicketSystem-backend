import jwt from 'jsonwebtoken';
import { CustomResponseType } from '../types/customResponseType';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { UserRepository } from '../repository/userRepository';
import { throwError } from '../utils/errorHandler';
import { UserDetailDto } from '../dto/userDetailDto';
import { IUser } from '../models/user';
import log4js from '../config/log4js';
const logger = log4js.getLogger(`UserRepository`);

export class UserService {
  private readonly userRepository: UserRepository = new UserRepository();

  public async createUser(
    account: string,
    email: string,
    pwd: string,
    confirmPwd: string,
  ): Promise<mongoose.Document> {
    this.userValidate(pwd, confirmPwd);
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
    return this.userRepository.createUser(account, email, hashPwd);
  }

  public async updateUserDetail(
    userDetailDto: UserDetailDto,
  ): Promise<IUser | null | void> {
    return this.userRepository.updateUserDetail(userDetailDto).catch((err) => {
      logger.error(err);
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

  public generateJWT(userId: string, accountType: string): string {
    const privateKey: any = process.env.JWT_SECRETS;
    console.log(privateKey);
    const defaultOptions: object = {
      expiresIn: process.env.JWT_EXPIRES,
    };
    return jwt.sign(
      { id: userId, accountType: accountType },
      privateKey,
      Object.assign(defaultOptions),
    );
  }

  public async generateForgotPasswordJWT(
    password: string,
    payload: string,
  ): Promise<string> {
    const privateKey: any = process.env.JWT_SECRETS + password;
    const defaultOptions: object = {
      expiresIn: process.env.JWT_EXPIRES,
    };
    return jwt.sign(payload, privateKey, Object.assign(defaultOptions));
  }

  private userValidate(pwd: string, confirmPwd: string): void {
    if (pwd !== confirmPwd) {
      throwError(
        CustomResponseType.PWD_CONFIRMPWD_NOT_THE_SAME_MESSAGE,
        CustomResponseType.PWD_CONFIRMPWD_NOT_THE_SAME,
      );
    }
  }

  // const validateToken = function (token: string): Object {
  //     try {
  //         const publicKey: any = process.env.JWT_SECRETS;
  //         return jwt.verify(token, publicKey);
  //     } catch (e) {
  //         throw new HttpError({
  //             title: 'invalid_token',
  //             detail: 'Invalid token',
  //             code: 400,
  //         });
  //     }};
}
