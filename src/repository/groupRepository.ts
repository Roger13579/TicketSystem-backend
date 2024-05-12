import { CreateGroupDto } from '../dto/createGroupDto';
import { GroupModel, IGroup } from '../models/group';

export class GroupRepository {
  public async createGroup(createGroupDto: CreateGroupDto): Promise<IGroup> {
    return GroupModel.create(new GroupModel(createGroupDto));
  }
}
