import { BaseController } from './baseController';
import { CustomResponseType } from '../types/customResponseType';
import { ResponseObject } from '../utils/responseObject';
import { UserService } from '../service/userService';
import { JWTPayloadDTO } from '../dto/jwtPayloadDto';
import { UserDetailVo } from '../vo/userDetailVo';
import { UserDetailDto } from '../dto/user/userDetailDto';
import { IUserReq } from '../types/common.type';
import { IUser } from '../models/user';
import { EditFavoriteDTO } from '../dto/user/editFavoriteDto';
import { IGetUserFavoriteReq } from '../types/user.type';
import { GetUserFavoriteDTO } from '../dto/user/getUserFavoriteDto';
import { GetFavoriteVO } from '../vo/user/getFavoriteVo';

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

  public getUserFavorite = async (req: IGetUserFavoriteReq) => {
    const getUserFavoriteDto = new GetUserFavoriteDTO(req);
    const { page, limit } = getUserFavoriteDto;
    const info = await this.userService.getFavorite(getUserFavoriteDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      new GetFavoriteVO(info, page, limit),
    );
  };

  public addFavorite = async (req: IUserReq) => {
    const editFavoriteDto = new EditFavoriteDTO(req);
    const info = await this.userService.addFavorite(editFavoriteDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      { favorites: info?.favorites || [] },
    );
  };

  public deleteFavorite = async (req: IUserReq) => {
    const editFavoriteDto = new EditFavoriteDTO(req);
    const info = await this.userService.deleteFavorite(editFavoriteDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      { favorites: info?.favorites || [] },
    );
  };
}

export default UserController;
