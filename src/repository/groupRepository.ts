import { CreateGroupDto } from '../dto/createGroupDto';
import { GroupModel, IGroup } from '../models/group';

export class GroupRepository {
  public async createGroup(createGroupDto: CreateGroupDto): Promise<IGroup> {
    return GroupModel.create(new GroupModel(createGroupDto));
  }
}
// {
//   userId: new Types.ObjectId(createGroupDto.getUserId),
//     title: createGroupDto.getTitle,
//   theater: createGroupDto.getTheater,
//   movieTitle: createGroupDto.getMovieTitle,
//   time: createGroupDto.getTime,
//   amount: createGroupDto.getAmount,
//   haveTicket: createGroupDto.getHaveTicket,
//   content: createGroupDto.getContent,
//   status: 'ongoing',
// }
