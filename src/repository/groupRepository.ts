import { CreateGroupDto } from '../dto/createGroupDto';
import { GroupModel, IGroup } from '../models/group';
import { UpdateGroupDto } from '../dto/updateGroupDto';
import { Types } from 'mongoose';
import { JoinGroupDto } from '../dto/joinGroupDto';

export class GroupRepository {
  public async createGroup(createGroupDto: CreateGroupDto): Promise<IGroup> {
    return GroupModel.create(new GroupModel(createGroupDto));
  }

  public async findById(groupId: string): Promise<IGroup | null> {
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
}
