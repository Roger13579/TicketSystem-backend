import { Request } from 'express';
import { parseDate } from '../utils/common';
import { Types } from 'mongoose';

export class CreateGroupDto {
  private readonly userId: Types.ObjectId;
  private readonly title: string;
  private readonly theater: string;
  private readonly movieTitle: string;
  private readonly time: Date;
  private readonly amount: number;
  private readonly haveTicket: boolean;
  private readonly content: string;
  private readonly status: string;

  get getUserId(): Types.ObjectId {
    return this.userId;
  }
  get getTitle(): string {
    return this.title;
  }
  get getTheater(): string {
    return this.theater;
  }
  get getMovieTitle(): string {
    return this.movieTitle;
  }
  get getTime(): Date {
    return this.time;
  }
  get getHaveTicket(): boolean {
    return this.haveTicket;
  }
  get getAmount(): number {
    return this.amount;
  }
  get getContent(): string {
    return this.content;
  }
  get getStatus(): string {
    return this.status;
  }
  constructor(req: Request) {
    const { title, location, movieTitle, time, amount, haveTicket, content } =
      req.body;
    this.userId = new Types.ObjectId((req.user as any).id as string);
    this.title = title;
    this.theater = location;
    this.movieTitle = movieTitle;
    this.time = parseDate('time', time) as Date;
    this.amount = amount;
    this.haveTicket = haveTicket;
    this.content = content;
    this.status = 'ongoing';
  }
}
