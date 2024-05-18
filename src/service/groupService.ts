import { CustomResponseType } from '../types/customResponseType';
import { throwError } from '../utils/errorHandler';
import log4js from '../config/log4js';
import { CreateGroupDto } from '../dto/group/createGroupDto';
import { GroupRepository } from '../repository/groupRepository';
import { IGroup } from '../models/group';
import { UpdateGroupDto } from '../dto/group/updateGroupDto';
import { JoinGroupDto } from '../dto/group/joinGroupDto';
import { UserRepository } from '../repository/userRepository';
import { Types } from 'mongoose';
import { LeaveGroupDto } from '../dto/group/leaveGroupDto';
import { IUser } from '../models/user';
import { IParticipant } from '../types/group.type';
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
  ): Promise<IUser | null | void> {
    const group = await this.groupRepository.findById(joinGroupDto.groupId);
    if (!group) {
      throwError(
        CustomResponseType.NO_DATA_FOUND_MESSAGE +
          ` : + ${joinGroupDto.groupId}`,
        CustomResponseType.NO_DATA_FOUND,
      );
    } else {
      // 檢查是否已加入過此揪團活動
      const participant = group.participant as IParticipant[];
      const objectId = new Types.ObjectId(joinGroupDto.userId).toString();
      const matchGroup = participant
        .map((user) => user.userId)
        .filter((userId) => userId.toString() === objectId);
      if (matchGroup.length > 0) {
        throwError(
          CustomResponseType.GROUP_ALREADY_JOINED_MESSAGE,
          CustomResponseType.GROUP_ALREADY_JOINED,
        );
      }
      // 檢查人數是否已滿
      const groupSize = group.amount;
      const length = participant.length;
      if (length === groupSize - 1) {
        throwError(
          CustomResponseType.GROUP_IS_FULL_MESSAGE,
          CustomResponseType.GROUP_IS_FULL,
        );
      }
      // 加入group中的participant
      try {
        await this.groupRepository.joinGroup(group, joinGroupDto);
        await this.userRepository.addGroupToUser(
          joinGroupDto.userId,
          joinGroupDto.groupId,
        );
      } catch (err) {
        logger.error('join group fail', err);
        throwError(
          CustomResponseType.UPDATE_ERROR_MESSAGE,
          CustomResponseType.UPDATE_ERROR,
        );
      }
    }
  }
  public async leaveGroup(
    leaveGroupDto: LeaveGroupDto,
  ): Promise<IUser | null | void> {
    const group = await this.groupRepository.findById(leaveGroupDto.groupId);
    if (!group) {
      throwError(
        CustomResponseType.NO_DATA_FOUND_MESSAGE +
          ` : ${leaveGroupDto.groupId}`,
        CustomResponseType.NO_DATA_FOUND,
      );
    } else {
      try {
        await this.groupRepository.leaveGroup(leaveGroupDto);
        await this.userRepository.removeGroupFromUser(
          leaveGroupDto.userId,
          leaveGroupDto.groupId,
        );
      } catch (err) {
        logger.error('leave group fail', err);
        throwError(
          CustomResponseType.UPDATE_ERROR_MESSAGE,
          CustomResponseType.UPDATE_ERROR,
        );
      }
    }
  }
}
