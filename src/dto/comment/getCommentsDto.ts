import moment from 'moment';
import { CommentSortField, IGetCommentsReq } from '../../types/comment.type';
import { SortOrder, Status } from '../../types/common.type';
import { AccountType } from '../../types/user.type';
import { IUser } from '../../models/user';
import { Types } from 'mongoose';

export class GetCommentsDTO {
  private readonly _productName?: string;
  private _productIds?: Types.ObjectId[]; // 如果使用 productName 模糊搜尋，就需要
  private readonly _limit: number = 10;
  private readonly _page: number = 1;
  private readonly _status?: Status;
  private readonly _ratings?: number[];
  private readonly _createdAtFrom?: Date;
  private readonly _createdAtTo?: Date;
  private readonly _accounts?: string[];
  private readonly _content?: string;
  private readonly _sort: Record<string, 1 | -1>;
  private readonly _isAdmin: boolean = false;
  private readonly _isLogin: boolean = false;
  private readonly _userId?: Types.ObjectId;

  /**
   * @description lookup to users
   */
  get accounts() {
    return this._isAdmin ? this._accounts : undefined;
  }

  /**
   * @description lookup to products
   */
  get productNameRegex() {
    return this._productName && this._isAdmin
      ? new RegExp(this._productName)
      : undefined;
  }

  get filter() {
    const contentRegex = this._content ? new RegExp(this._content) : undefined;
    /**
     * @description 已登入使用者 + 看自己的 comment => 在已登入的情況下，沒有 productId 就搜自己的所有 product
     */
    const memberFilter = {
      ...(!this._productIds &&
        this._userId &&
        this._isLogin &&
        !this._isAdmin && { userId: this._userId }),
    };

    return {
      ...memberFilter,
      // 如果有 productId 就先搜 productId
      ...(!!this._productIds && { productId: { $in: this._productIds } }),
      ...(this._status && { status: this._status }),
      ...(!!this._ratings && { rating: { $in: this._ratings } }),
      ...(contentRegex && { content: { $regex: contentRegex } }),
      ...((this._createdAtFrom || this._createdAtTo) && {
        createdAt: {
          ...(this._createdAtFrom && { $lte: this._createdAtFrom }),
          ...(this._createdAtTo && { $gte: this._createdAtTo }),
        },
      }),
    };
  }

  get page() {
    return this._page;
  }

  get limit() {
    return this._limit;
  }

  get sort(): Record<string, 1 | -1> {
    return this._sort;
  }

  get projection() {
    return {
      _id: 1,
      rating: 1,
      content: 1,
      createdAt: 1,
      status: this._isAdmin ? 1 : -1, // admin 才能看到 status
      user: {
        ...(this._isAdmin && { _id: '$user._id' }),
        account: '$user.account',
        avatarPath: '$user.avatarPath',
        name: '$user.name',
      },
      productId: 1,
    };
  }

  get options() {
    return {
      sort: this._sort,
      skip: (this._page - 1) * this._limit,
      limit: this._limit,
    };
  }

  constructor(req: IGetCommentsReq) {
    const { query, user } = req;
    const {
      productIds,
      productName,
      limit,
      page,
      status,
      ratings,
      createdAtFrom,
      createdAtTo,
      accounts,
      content,
      sortField,
      sortOrder,
    } = query;

    if (req.user && (req.user as IUser).accountType === AccountType.admin) {
      this._isAdmin = true;
    }

    if (user && (user as IUser)._id) {
      this._userId = (user as IUser)._id;
      this._isLogin = true;
    }

    this._productIds = productIds
      ?.split(',')
      .map((id) => new Types.ObjectId(id));
    this._productName = productName;

    this._limit = limit ? Number(limit) : 10;
    this._sort = {
      [`${sortField || CommentSortField.createdAt}`]:
        sortOrder === SortOrder.asc ? 1 : -1,
    };
    this._page = page ? Number(page) : 1;

    this._content = content;
    this._accounts = accounts?.split(',');
    this._ratings = ratings?.split(',').map((item) => Number(item));

    this._status = status;

    this._createdAtFrom = createdAtFrom
      ? moment(createdAtFrom).toDate()
      : undefined;
    this._createdAtTo = createdAtTo ? moment(createdAtTo).toDate() : undefined;
  }
}
