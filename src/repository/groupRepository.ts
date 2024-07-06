import { CreateGroupDto } from '../dto/group/createGroupDto';
import { GroupModel, IGroup } from '../models/group';
import { UpdateGroupDto } from '../dto/group/updateGroupDto';
import {
  PaginateResult,
  PaginateDocument,
  PaginateOptions,
  Types,
  FilterQuery,
} from 'mongoose';
import { JoinGroupDto } from '../dto/group/joinGroupDto';
import { LeaveGroupDto } from '../dto/group/leaveGroupDto';
import { GroupFilterDto } from '../dto/group/groupFilterDto';
import { updateOptions } from '../utils/constants';
import { GroupStatus } from '../types/group.type';

export class GroupRepository {
  public async createGroup(createGroupDto: CreateGroupDto) {
    return GroupModel.create(new GroupModel(createGroupDto));
  }

  public async findById(groupId: Types.ObjectId) {
    return GroupModel.findById(groupId);
  }

  public async findByIds(
    groupIds: string[],
    option: PaginateOptions | undefined,
  ) {
    return GroupModel.paginate(
      {
        _id: {
          $in: groupIds,
        },
      },
      option,
    );
  }

  public async findByUserId(
    filter: FilterQuery<IGroup> | undefined,
    option: PaginateOptions | undefined,
  ) {
    return GroupModel.paginate(filter, option);
  }

  public async updateGroup(updateGroupDto: UpdateGroupDto) {
    return GroupModel.findByIdAndUpdate(
      { _id: new Types.ObjectId(updateGroupDto.groupId) },
      {
        title: updateGroupDto.title,
        content: updateGroupDto.content,
      },
      updateOptions,
    );
  }
  public async updateExpiredStatusByGroupIds(groupIds: Types.ObjectId[]) {
    return GroupModel.updateMany(
      {
        _id: {
          $in: groupIds,
        },
      },
      {
        status: GroupStatus.cancelled,
      },
    );
  }

  public async joinGroup(group: IGroup, joinGroupDto: JoinGroupDto) {
    group.participant?.push(joinGroupDto.participant);
    return group.save();
  }

  public async leaveGroup(leaveGroupDto: LeaveGroupDto) {
    return GroupModel.findByIdAndUpdate(
      { _id: new Types.ObjectId(leaveGroupDto.groupId) },
      {
        $pull: {
          participant: {
            userId: new Types.ObjectId(leaveGroupDto.userId),
          },
        },
      },
      updateOptions,
    );
  }
  public async deleteGroup(groupId: Types.ObjectId) {
    return GroupModel.findByIdAndDelete({ _id: groupId });
  }
  public async findGroups({
    filter,
    options,
  }: GroupFilterDto): Promise<
    PaginateResult<
      PaginateDocument<IGroup, NonNullable<unknown>, PaginateOptions>
    >
  > {
    return GroupModel.paginate(filter, options);
  }
}
