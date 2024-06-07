import { IComment } from '../../models/comment';
import { IInvalidComment } from '../../types/comment.type';

export class UpdateCommentsVo {
  public readonly comments: IComment[];
  public readonly errors: IInvalidComment[];

  constructor(infos: (IInvalidComment | IComment)[]) {
    const invalidComments: IInvalidComment[] = [];
    const comments: IComment[] = [];

    infos.forEach((info) => {
      if ('subStatus' in info) {
        invalidComments.push(info as IInvalidComment);
      } else {
        comments.push(info);
      }
    });

    this.errors = invalidComments;
    this.comments = comments;
  }
}
