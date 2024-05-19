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
      { new: true },
    );
  }
  public async findGroups(
    groupFilterDto: GroupFilterDto,
  ): Promise<
    PaginateResult<
      PaginateDocument<IGroup, NonNullable<unknown>, PaginateOptions>
    >
  > {
    const { page, limit, sortBy } = groupFilterDto;
    const filter = this.groupFilter(groupFilterDto);
    const options = {
      ...(page && limit && { page: page - 1 }),
      ...(limit && { limit }),
      sort: sortBy || '-createdAt',
    };
    return GroupModel.paginate(filter, options);
  }

  private groupFilter(groupFilterDto: GroupFilterDto) {
    const {
      userId,
      title,
      movieTitle,
      status,
      theater,
      hasTicket,
      startAt,
      endAt,
      participantCount,
    } = groupFilterDto;
    const titleRegex = title ? new RegExp(title) : undefined;
    return {
      ...(userId && { userId: { $eq: userId } }),
      ...(titleRegex && { title: { $regex: titleRegex } }),
      ...(movieTitle && { movieTitle: { $in: movieTitle } }),
      ...(status && { status: { $eq: status } }),
      ...(theater && { theater: { $in: theater } }),
      ...(participantCount && { amount: { $eq: participantCount } }),
      ...(hasTicket !== undefined && { hasTicket }),
      ...((startAt || endAt) && {
        time: {
          ...(endAt && { $lte: endAt }),
          ...(startAt && { $gte: startAt }),
        },
      }),
    };
  }
}
