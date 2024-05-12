import { BaseController } from './baseController';
import { CustomResponseType } from '../types/customResponseType';
import { CreateGroupDto } from '../dto/createGroupDto';
import { GroupService } from '../service/groupService';
import { IGroup } from '../models/group';
import { TCreateGroupReq } from '../types/group.type';
import { ResponseObject } from '../utils/responseObject';

export class GroupController extends BaseController {
  private readonly groupService = new GroupService();

  public createGroup = async (
    req: TCreateGroupReq,
  ): Promise<ResponseObject> => {
    this.paramVerify(req);
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
}
