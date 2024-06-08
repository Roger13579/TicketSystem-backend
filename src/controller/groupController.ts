import { BaseController } from './baseController';
import { CustomResponseType } from '../types/customResponseType';
import { CreateGroupDto } from '../dto/group/createGroupDto';
import { GroupService } from '../service/groupService';
import { IGroup } from '../models/group';
import {
  IGetGroupsReq,
  TCreateGroupReq,
  TJoinGroupReq,
  TUpdateGroupReq,
} from '../types/group.type';
import { UpdateGroupDto } from '../dto/group/updateGroupDto';
import { JoinGroupDto } from '../dto/group/joinGroupDto';
import { LeaveGroupDto } from '../dto/group/leaveGroupDto';
import { GroupFilterDto } from '../dto/group/groupFilterDto';
import { GetGroupVo } from '../vo/group/getGroupVo';
import { Types } from 'mongoose';
import { IUser } from '../models/user';
import { TMethod } from '../types/common.type';

export class GroupController extends BaseController {
  private readonly groupService = new GroupService();

  public createGroup: TMethod<TCreateGroupReq> = async (req) => {
    const createGroupDto = new CreateGroupDto(req);
    const group = (await this.groupService.createGroup(
      createGroupDto,
    )) as IGroup;
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      {
        groupId: group.id,
      },
    );
  };
  public updateGroup: TMethod<TUpdateGroupReq> = async (req) => {
    const updateGroupDto = new UpdateGroupDto(req);
    await this.groupService.updateGroup(updateGroupDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
    );
  };
  public joinGroup: TMethod<TJoinGroupReq> = async (req) => {
    const joinGroupDto = new JoinGroupDto(req);
    await this.groupService.joinGroup(joinGroupDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      {},
    );
  };
  public leaveGroup: TMethod = async (req) => {
    const leaveGroupDto = new LeaveGroupDto(req);
    await this.groupService.leaveGroup(leaveGroupDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      {},
    );
  };
  public deleteGroup: TMethod = async (req) => {
    const userId = (req.user as IUser)._id;
    const groupId = new Types.ObjectId(req.params['groupId']);
    await this.groupService.deleteGroup(userId, groupId);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      {},
    );
  };
  public getGroups: TMethod<IGetGroupsReq> = async (req) => {
    const groupFilterDto = new GroupFilterDto(req);
    const groups = await this.groupService.findGroups(groupFilterDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      new GetGroupVo(groups),
    );
  };
}
