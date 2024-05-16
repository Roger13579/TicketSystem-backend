import { BaseController } from './baseController';
import { CustomResponseType } from '../types/customResponseType';
import { CreateGroupDto } from '../dto/createGroupDto';
import { GroupService } from '../service/groupService';
import { IGroup } from '../models/group';
import {
  TCreateGroupReq,
  TJoinGroupReq,
  TUpdateGroupReq,
} from '../types/group.type';
import { ResponseObject } from '../utils/responseObject';
import { UpdateGroupDto } from '../dto/updateGroupDto';
import { JoinGroupDto } from '../dto/joinGroupDto';

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
}
