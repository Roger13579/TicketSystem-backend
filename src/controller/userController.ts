import { BaseController } from './baseController';
import { CustomResponseType } from '../types/customResponseType';
import { ResponseObject } from '../utils/responseObject';
import { UserService } from '../service/userService';
import { JWTPayloadDTO } from '../dto/jwtPayloadDto';
import { UserDetailVo } from '../vo/userDetailVo';
import { UserDetailDto } from '../dto/userDetailDto';
import { IUserReq } from '../types/common.type';
import { IUser } from '../models/user';

class UserController extends BaseController {
  private readonly userService = new UserService();

  public getUserDetail = async (req: IUserReq): Promise<ResponseObject> => {
    const payload = new JWTPayloadDTO(req);
    const user = (await this.userService.findByAccount(
      payload.account,
    )) as IUser;
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      new UserDetailVo(user),
    );
  };

  public updateUserDetail = async (req: IUserReq): Promise<ResponseObject> => {
    const userDetailDto = new UserDetailDto(req);
    await this.userService.updateUserDetail(userDetailDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
    );
  };
}

export default UserController;
