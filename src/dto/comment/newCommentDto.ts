import { Types } from 'mongoose';
import { Status } from '../../types/common.type';
import { ICommentProductReq } from '../../types/comment.type';
import { IUser } from '../../models/user';

export class NewCommentDTO {
  private readonly _userId: Types.ObjectId;
  private readonly _productId: Types.ObjectId;
  private readonly _rating: number;
  private readonly _content: string;
  private readonly _status: Status;

  get comment() {
    return {
      userId: this._userId,
      productId: this._productId,
      rating: this._rating,
      content: this._content,
      status: this._status,
    };
  }

  constructor(req: ICommentProductReq) {
    const { user, body } = req;
    const { content, productId, rating, status } = body;
    this._userId = (user as IUser)._id;
    this._content = content;
    this._productId = productId;
    this._rating = rating;
    this._status = status;
  }
}
