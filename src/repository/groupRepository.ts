import { CreateGroupDto } from '../dto/group/createGroupDto';
import { GroupModel, IGroup } from '../models/group';
import { UpdateGroupDto } from '../dto/group/updateGroupDto';
import {
  PaginateResult,
  PaginateDocument,
  PaginateOptions,
  Types,
} from 'mongoose';
import { JoinGroupDto } from '../dto/group/joinGroupDto';
import { LeaveGroupDto } from '../dto/group/leaveGroupDto';
import { GroupFilterDto } from '../dto/group/groupFilterDto';
import { updateOptions } from '../utils/constants';

export class GroupRepository {
  public async createGroup(createGroupDto: CreateGroupDto): Promise<IGroup> {
    return GroupModel.create(new GroupModel(createGroupDto));
  }

  public async findById(groupId: Types.ObjectId): Promise<IGroup | null> {
    return GroupModel.findById(groupId);
  }

  public async updateGroup(
    updateGroupDto: UpdateGroupDto,
  ): Promise<IGroup | null> {
    return GroupModel.findByIdAndUpdate(
      { _id: new Types.ObjectId(updateGroupDto.groupId) },
      {
        title: updateGroupDto.title,
        content: updateGroupDto.content,
      },
      updateOptions,
    );
  }

  public async joinGroup(
    group: IGroup,
    joinGroupDto: JoinGroupDto,
  ): Promise<IGroup | null> {
    group.participant?.push(joinGroupDto.participant);
    return group.save();
  }

  public async leaveGroup(
    leaveGroupDto: LeaveGroupDto,
  ): Promise<IGroup | null> {
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
  public async deleteGroup(groupId: Types.ObjectId): Promise<IGroup | null> {
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
