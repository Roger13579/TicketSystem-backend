import { IComment } from '../../models/comment';
import { IUser } from '../../models/user';

export class GetCommentsVo {
  private comments: Array<
    Pick<IComment, '_id' | 'rating' | 'content' | 'createdAt'> & {
      user: Pick<IUser, 'account' | 'avatarPath'>;
    }
  > = [];
  private page: number = 1;
  private limit: number = 0;
  private totalCount: number = 0;
  constructor(
    info:
      | {
          comments: (Pick<
            IComment,
            '_id' | 'rating' | 'content' | 'createdAt'
          > & { user: { account: string[]; avatarPath: string[] }[] })[];
          totalCount: number;
        }
      | undefined,
    page: number | undefined,
    limit: number | undefined,
  ) {
    this.comments =
      info?.comments.map(({ _id, rating, content, createdAt, user }) => ({
        _id,
        rating,
        content,
        createdAt,
        user: {
          account: user[0].account[0],
          avatarPath: user[0].avatarPath[0],
        },
      })) || [];
    this.page = page || 1;
    this.limit = limit || info?.totalCount || 0;
    this.totalCount = info?.totalCount || 0;
  }
}
