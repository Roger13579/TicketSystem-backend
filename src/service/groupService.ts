import { CustomResponseType } from '../types/customResponseType';
import { throwError } from '../utils/errorHandler';
import log4js from '../config/log4js';
import { CreateGroupDto } from '../dto/createGroupDto';
import { GroupRepository } from '../repository/groupRepository';
import { IGroup } from '../models/group';
const logger = log4js.getLogger(`GroupService`);

export class GroupService {
  private readonly groupRepository: GroupRepository = new GroupRepository();

  public async createGroup(
    createGroupDto: CreateGroupDto,
  ): Promise<IGroup | void> {
    return this.groupRepository.createGroup(createGroupDto).catch((err) => {
      logger.error('create user error', err);
      throwError(
        CustomResponseType.INSERT_ERROR_MESSAGE,
        CustomResponseType.INSERT_ERROR,
      );
    });
  }
}
