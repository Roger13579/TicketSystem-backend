import { CreateGroupDto } from '../dto/createGroupDto';
import { GroupModel, IGroup } from '../models/group';
import { UpdateGroupDto } from '../dto/updateGroupDto';
import { Types } from 'mongoose';

export class GroupRepository {
  public async createGroup(createGroupDto: CreateGroupDto): Promise<IGroup> {
    return GroupModel.create(new GroupModel(createGroupDto));
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
}
