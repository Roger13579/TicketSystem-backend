import { CustomResponseType } from '../types/customResponseType';
import { throwError } from '../utils/errorHandler';
import log4js from '../config/log4js';
import { CreateGroupDto } from '../dto/createGroupDto';
import { GroupRepository } from '../repository/groupRepository';
import { IGroup } from '../models/group';
import { UpdateGroupDto } from '../dto/updateGroupDto';
import { JoinGroupDto } from '../dto/joinGroupDto';
import { UserRepository } from '../repository/userRepository';
import { Types } from 'mongoose';
import { IGroupId } from '../models/baseModel';
const logger = log4js.getLogger(`GroupService`);

export class GroupService {
  private readonly groupRepository: GroupRepository = new GroupRepository();
  private readonly userRepository: UserRepository = new UserRepository();

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

  public async joinGroup(
    joinGroupDto: JoinGroupDto,
  ): Promise<IGroup | null | void> {
    const group = await this.groupRepository.findById(joinGroupDto.groupId);
    if (!group) {
      throwError(
        CustomResponseType.NO_DATA_FOUND_MESSAGE +
          ` : + ${joinGroupDto.groupId}`,
        CustomResponseType.NO_DATA_FOUND,
      );
    } else {
      // 檢查是否已加入過此揪團活動
      const user = await this.userRepository.findById(joinGroupDto.userId);
      if (user) {
        const groups = user.groups as [IGroupId];
        const objectId = new Types.ObjectId(joinGroupDto.groupId).toString();
        const matchGroup = groups
          .map((group) => group.groupId)
          .filter((groupId) => groupId.toString() === objectId);
        if (matchGroup.length > 0) {
          throwError(
            CustomResponseType.GROUP_ALREADY_JOINED_MESSAGE,
            CustomResponseType.GROUP_ALREADY_JOINED,
          );
        }
      }
      // 檢查人數是否已滿，扣除建立者
      const groupSize = group.amount;
      const length = group.participant?.length;
      if (length === groupSize - 1) {
        throwError(
          CustomResponseType.GROUP_IS_FULL_MESSAGE,
          CustomResponseType.GROUP_IS_FULL,
        );
      }
      // 加入group中的participant
      this.groupRepository.joinGroup(group, joinGroupDto).catch((err) => {
        logger.error('join group fail', err);
        throwError(
          CustomResponseType.UPDATE_ERROR_MESSAGE,
          CustomResponseType.UPDATE_ERROR,
        );
      });
      // 把groupId加入user groups中
      this.userRepository
        .updateGroupUser(joinGroupDto.userId, joinGroupDto.groupId)
        .catch((err) => {
          logger.error('join group fail', err);
          throwError(
            CustomResponseType.UPDATE_ERROR_MESSAGE,
            CustomResponseType.UPDATE_ERROR,
          );
        });
    }
  }
}
