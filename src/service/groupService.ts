import { CustomResponseType } from '../types/customResponseType';
import { throwError } from '../utils/errorHandler';
import log4js from '../config/log4js';
import { CreateGroupDto } from '../dto/createGroupDto';
import { GroupRepository } from '../repository/groupRepository';
import { IGroup } from '../models/group';
import { UpdateGroupDto } from '../dto/updateGroupDto';
const logger = log4js.getLogger(`GroupService`);

export class GroupService {
  private readonly groupRepository: GroupRepository = new GroupRepository();

  public async createGroup(
    createGroupDto: CreateGroupDto,
  ): Promise<IGroup | void> {
    return this.groupRepository.createGroup(createGroupDto).catch((err) => {
      logger.error('create group error', err);
      throwError(
        CustomResponseType.INSERT_ERROR_MESSAGE,
        CustomResponseType.INSERT_ERROR,
      );
    });
  }

  public async updateGroup(
    updateGroupDto: UpdateGroupDto,
  ): Promise<IGroup | null | void> {
    return this.groupRepository.updateGroup(updateGroupDto).catch((err) => {
      logger.error('update group error', err);
      throwError(
        CustomResponseType.UPDATE_ERROR_MESSAGE,
        CustomResponseType.UPDATE_ERROR,
      );
    });
  }
}
