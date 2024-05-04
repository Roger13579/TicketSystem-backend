import {NextFunction, Request, Response} from 'express';
import { BaseController } from './baseController';
import log4js from '../config/log4js';
import { CustomResponseType } from '../types/customResponseType';
import { ResponseObject } from '../utils/responseObject';
import { UserService } from '../service/user.service';
import { JWTPayloadDTO } from '../dto/jwtPayloadDto';
import { UserDetailVo } from '../vo/userDetailVo';
import { UserDetailDto } from '../dto/userDetailDto';

class UserController extends BaseController {
  private readonly userService = new UserService();

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
