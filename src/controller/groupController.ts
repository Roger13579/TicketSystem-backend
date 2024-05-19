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
import { ResponseObject } from '../utils/responseObject';
import { UpdateGroupDto } from '../dto/group/updateGroupDto';
import { JoinGroupDto } from '../dto/group/joinGroupDto';
import { LeaveGroupDto } from '../dto/group/leaveGroupDto';
import { Request } from 'express';
import { GroupFilterDto } from '../dto/group/groupFilterDto';
import { GetGroupVo } from '../vo/group/getGroupVo';

export class GroupController extends BaseController {
  private readonly groupService = new GroupService();

  public createGroup = async (
    req: TCreateGroupReq,
  ): Promise<ResponseObject> => {
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
  public updateGroup = async (
    req: TUpdateGroupReq,
  ): Promise<ResponseObject> => {
    const updateGroupDto = new UpdateGroupDto(req);
    await this.groupService.updateGroup(updateGroupDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
    );
  };
  public joinGroup = async (req: TJoinGroupReq): Promise<ResponseObject> => {
    const joinGroupDto = new JoinGroupDto(req);
    await this.groupService.joinGroup(joinGroupDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      {},
    );
  };
  public leaveGroup = async (req: Request): Promise<ResponseObject> => {
    const leaveGroupDto = new LeaveGroupDto(req);
    await this.groupService.leaveGroup(leaveGroupDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      {},
    );
  };
  public getGroups = async (req: IGetGroupsReq): Promise<ResponseObject> => {
    const groupFilterDto = new GroupFilterDto(req);
    const groups = await this.groupService.findGroups(groupFilterDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      new GetGroupVo(groups),
    );
  };
}
