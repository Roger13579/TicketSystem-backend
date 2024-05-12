import { parseDate } from '../utils/common';
import { Types } from 'mongoose';
import { GroupStatus, TCreateGroupReq } from '../types/group.type';
import { IUser } from '../models/user';

export class CreateGroupDto {
  private readonly userId: Types.ObjectId;
  private readonly title: string;
  private readonly theater: string;
  private readonly movieTitle: string;
  private readonly time: Date;
  private readonly amount: number;
  private readonly haveTicket: boolean;
  private readonly content?: string;
  private readonly status: string;

  constructor(req: TCreateGroupReq) {
    this.userId = new Types.ObjectId((req.user as IUser).id);
    this.title = req.body.title;
    this.theater = req.body.theater;
    this.movieTitle = req.body.movieTitle;
    this.time = parseDate('time', req.body.time.toString()) as Date;
    this.amount = req.body.amount;
    this.haveTicket = req.body.haveTicket;
    this.content = req.body.content;
    this.status = GroupStatus.ongoing;
  }
}
