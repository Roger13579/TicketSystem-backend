import { BaseController } from './baseController';
import { CustomResponseType } from '../types/customResponseType';
import { UserService } from '../service/userService';
import { JWTPayloadDTO } from '../dto/user/jwtPayloadDto';
import { UserDetailVo } from '../vo/userDetailVo';
import { UserDetailDto } from '../dto/user/userDetailDto';
import { TMethod } from '../types/common.type';
import { IUser } from '../models/user';
import { EditFavoriteDTO } from '../dto/user/editFavoriteDto';
import { IGetUserFavoriteReq, IUpdateUserDetailReq } from '../types/user.type';
import { GetUserFavoriteDTO } from '../dto/user/getUserFavoriteDto';
import { GetFavoriteVO } from '../vo/user/getFavoriteVo';
import { SellTicketDto } from '../dto/ticket/sellTicketDto';
import {
  IGetTicketsReq,
  ISellTicketReq,
  ITicketRefundReq,
} from '../types/ticket.type';
import { GetUserGroupDto } from '../dto/group/getUserGroupDto';
import { GetGroupVo } from '../vo/group/getGroupVo';
import { PaginateDocument, PaginateOptions, PaginateResult } from 'mongoose';
import { IGroup } from '../models/group';
import { IGetUserGroupsReq } from '../types/group.type';
import { TicketRefundDto } from '../dto/ticket/TicketRefundDto';
import { TicketService } from '../service/ticketService';

export class UserController extends BaseController {
  private readonly userService = new UserService();
  private readonly ticketService = new TicketService();

  public getUserDetail: TMethod = async (req) => {
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

  public updateUserDetail: TMethod<IUpdateUserDetailReq> = async (req) => {
    const userDetailDto = new UserDetailDto(req);
    await this.userService.updateUserDetail(userDetailDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
    );
  };

  public getUserFavorite: TMethod<IGetUserFavoriteReq> = async (req) => {
    const getUserFavoriteDto = new GetUserFavoriteDTO(req);
    const { page, limit } = getUserFavoriteDto;
    const info = await this.userService.getFavorite(getUserFavoriteDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      new GetFavoriteVO(info, page, limit),
    );
  };

  public addFavorite: TMethod = async (req) => {
    const editFavoriteDto = new EditFavoriteDTO(req);
    const info = await this.userService.addFavorite(editFavoriteDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      { favorites: info?.favorites || [] },
    );
  };

  public deleteFavorite: TMethod = async (req) => {
    const editFavoriteDto = new EditFavoriteDTO(req);
    const info = await this.userService.deleteFavorite(editFavoriteDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      { favorites: info?.favorites || [] },
    );
  };

  public sellTicket: TMethod = async (req: ISellTicketReq) => {
    const editFavoriteDto = new SellTicketDto(req);
    await this.userService.sellTicket(editFavoriteDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      {},
    );
  };
  public getTransferableTicket = async (req: IGetTicketsReq) => {
    const tickets = await this.userService.getTransferableTicket(
      (req.user as IUser)._id,
      req.query.isPublished,
    );
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      tickets,
    );
  };

  public getUserGroups: TMethod = async (req: IGetUserGroupsReq) => {
    const getUserGroupDto = new GetUserGroupDto(req);
    const groups = (await this.userService.getUserGroups(
      getUserGroupDto,
    )) as PaginateResult<
      PaginateDocument<IGroup, NonNullable<unknown>, PaginateOptions>
    >;
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      new GetGroupVo(groups),
    );
  };

  public ticketRefund = async (req: ITicketRefundReq) => {
    const ticketRefundDto = new TicketRefundDto(req);
    const tickets = await this.ticketService.ticketRefund(ticketRefundDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      { orderId: tickets[0].orderId, refundTicketsCount: tickets.length },
    );
  };

  public useTicket: TMethod = async (req) => {
    const jwtString = await this.userService.useTicket(req.params.ticketId);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      { qrCode: jwtString },
    );
  };
}
