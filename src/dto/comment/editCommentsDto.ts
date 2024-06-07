import { Types } from 'mongoose';
import { IEditComment, IEditCommentsReq } from '../../types/comment.type';

export class EditCommentsDTO {
  private readonly _comments: IEditComment[];

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
