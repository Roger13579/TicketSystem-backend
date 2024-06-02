import { Types } from 'mongoose';
import { Status } from '../../types/common.type';
import { IEditCommentsReq } from '../../types/comment.type';

export class EditCommentsDTO {
  private readonly _comments: { id: Types.ObjectId; status: Status }[];

  get comments() {
    return this._comments;
  }

  constructor(req: IEditCommentsReq) {
    this._comments = req.body.comments.map(({ id, status }) => ({
      id: new Types.ObjectId(id),
      status,
    }));
  }
}
