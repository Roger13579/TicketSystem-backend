import { CustomResponseType } from '../types/customResponseType';
import { throwError } from '../utils/errorHandler';
import log4js from '../config/log4js';
import { CreateGroupDto } from '../dto/group/createGroupDto';
import { GroupRepository } from '../repository/groupRepository';
import { UpdateGroupDto } from '../dto/group/updateGroupDto';
import { JoinGroupDto } from '../dto/group/joinGroupDto';
import { UserRepository } from '../repository/userRepository';
import { Types } from 'mongoose';
import { LeaveGroupDto } from '../dto/group/leaveGroupDto';
import { GroupFilterDto } from '../dto/group/groupFilterDto';
import { GroupDocument } from '../types/group.type';

const logger = log4js.getLogger(`GroupService`);

export class GroupService {
  private readonly groupRepository: GroupRepository = new GroupRepository();
  private readonly userRepository: UserRepository = new UserRepository();
  public async createGroup(createGroupDto: CreateGroupDto) {
    return this.groupRepository.createGroup(createGroupDto).catch((err) => {
      logger.error('create group error', err);
      throwError(
        CustomResponseType.INSERT_ERROR_MESSAGE,
        CustomResponseType.INSERT_ERROR,
      );
    });
  }

  public async updateGroup(updateGroupDto: UpdateGroupDto) {
    return this.groupRepository.updateGroup(updateGroupDto).catch((err) => {
      logger.error('update group error', err);
      throwError(
        CustomResponseType.UPDATE_ERROR_MESSAGE,
        CustomResponseType.UPDATE_ERROR,
      );
    });
  }

  public async joinGroup(joinGroupDto: JoinGroupDto) {
    const group = await this.groupRepository.findById(joinGroupDto.groupId);
    if (!group) {
      throwError(
        CustomResponseType.NO_DATA_FOUND_MESSAGE +
          ` : + ${joinGroupDto.groupId}`,
        CustomResponseType.NO_DATA_FOUND,
      );
    } else {
      // 檢查是否已加入過此揪團活動
      const participant = group.participant || [];
      const matchGroup = participant
        .map((user) => user.userId)
        .filter(
          (userId) => userId.toString() === joinGroupDto.userId.toString(),
        );
      if (matchGroup.length > 0) {
        return {
          code: CustomResponseType.GROUP_ALREADY_JOINED,
          message: CustomResponseType.GROUP_ALREADY_JOINED_MESSAGE,
        };
      }
      // 檢查人數是否已滿
      const groupSize = group.amount;
      const length = participant.length;
      if (length === groupSize) {
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
  public async leaveGroup(leaveGroupDto: LeaveGroupDto) {
    const group = await this.groupRepository.findById(leaveGroupDto.groupId);
    if (!group) {
      throwError(
        CustomResponseType.NO_DATA_FOUND_MESSAGE +
          ` : ${leaveGroupDto.groupId}`,
        CustomResponseType.NO_DATA_FOUND,
      );
    } else {
      if (leaveGroupDto.userId.toString() === group.userId.toString()) {
        throwError(
          CustomResponseType.GROUP_OWNER_CAN_NOT_LEAVE_MESSAGE,
          CustomResponseType.GROUP_OWNER_CAN_NOT_LEAVE,
        );
      }
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
  public async deleteGroup(userId: Types.ObjectId, groupId: Types.ObjectId) {
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throwError(
        CustomResponseType.NO_DATA_FOUND_MESSAGE + ` : ${groupId.toString()}`,
        CustomResponseType.NO_DATA_FOUND,
      );
    } else {
      if ((group.participant || []).length > 1) {
        throwError(
          CustomResponseType.GROUP_MEMBER_NOT_EMPTY_MESSAGE,
          CustomResponseType.GROUP_MEMBER_NOT_EMPTY,
        );
      }
      if (userId.toString() !== group.userId.toString()) {
        throwError(
          CustomResponseType.NOT_GROUP_OWNER_MESSAGE,
          CustomResponseType.NOT_GROUP_OWNER,
        );
      }
      try {
        await this.groupRepository.deleteGroup(groupId);
      } catch (err) {
        logger.error('delete group fail', err);
        throwError(
          CustomResponseType.DELETE_ERROR_MESSAGE,
          CustomResponseType.DELETE_ERROR,
        );
      }
    }
  }
  public async findGroups(groupFilterDto: GroupFilterDto) {
    const result = await this.groupRepository.findGroups(groupFilterDto);
    result.docs = result.docs.map((doc) => {
      const participantLength =
        doc.participant != undefined ? doc.participant.length : 0;
      const docObj = doc.toObject();
      delete docObj.participant;
      return {
        ...docObj,
        vacancy: doc.amount - participantLength,
      } as GroupDocument;
    });
    return result;
  }

  public async findGroupDetail(groupId: string) {
    const group = await this.groupRepository.findById(
      new Types.ObjectId(groupId),
    );
    if (group) {
      const participantLength =
        group.participant != undefined ? group.participant.length : 0;
      return {
        ...group.toObject(),
        vacancy: group.amount - participantLength,
      } as GroupDocument;
    } else {
      throwError(
        CustomResponseType.NO_DATA_FOUND_MESSAGE + ` : ${groupId}`,
        CustomResponseType.NO_DATA_FOUND,
      );
    }
  }
}
