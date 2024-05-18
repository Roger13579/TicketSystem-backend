import { Types } from 'mongoose';
import {
  GroupStatus,
  IParticipant,
  TCreateGroupReq,
} from '../../types/group.type';
import { IUser } from '../../models/user';
import moment from 'moment';

export class CreateGroupDto {
  private readonly userId: Types.ObjectId;
  private readonly title: string;
  private readonly placeholderImg: string;
  private readonly theater: string;
  private readonly movieTitle: string;
  private readonly time: Date;
  private readonly amount: number;
  private readonly haveTicket: boolean;
  private readonly content?: string;
  private readonly status: string;
  private readonly participant: IParticipant;

  constructor(req: TCreateGroupReq) {
    const id = new Types.ObjectId((req.user as IUser).id);
    this.userId = id;
    this.title = req.body.title;
    this.placeholderImg = req.body.placeholderImg;
    this.theater = req.body.theater;
    this.movieTitle = req.body.movieTitle;
    this.time = moment(req.body.time).toDate();
    this.amount = req.body.amount;
    this.haveTicket = req.body.haveTicket;
    this.content = req.body.content;
    this.status = GroupStatus.ongoing;
    this.participant = req.body.participant;
    this.participant.userId = id;
  }
}
