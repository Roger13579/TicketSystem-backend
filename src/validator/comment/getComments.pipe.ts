import { Meta, query } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';
import { IUser } from '../../models/user';
import { AccountType } from '../../types/user.type';
import { IUserReq, Status } from '../../types/common.type';
import {
  CommentSortBy,
  IGetCommentsReq,
  RatingRange,
} from '../../types/comment.type';
import moment from 'moment';

export class GetCommentsPipe extends PipeBase {
  public transform = () => [
    query('limit')
      .exists()
      .withMessage(CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE + 'limit')
      .toInt()
      .withMessage(CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE + 'limit')
      .isInt({ min: 1, max: 100 })
      .withMessage(CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE + 'limit'),
    query('page')
      .exists()
      .withMessage(CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE + 'page')
      .toInt()
      .withMessage(CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE + 'page')
      .isInt({ min: 1 })
      .withMessage(CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE + 'page'),
    query('status')
      .custom((value: string | undefined, { req }: Meta) => {
        const { accountType } = req.user as IUser;

        return (
          accountType === AccountType.admin ||
          (accountType === AccountType.member && value === Status.active)
        );
      })
      .withMessage(
        CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE + 'status',
      ),
    query('ratings')
      .optional()
      .custom((value: string | undefined) =>
        this.isValidOption(value, 'array', RatingRange),
      )
      .withMessage(
        CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE + 'rating',
      ),
    query('createdAtFrom')
      .optional()
      .custom(this.isValidDate)
      .custom((value: string, { req }: Meta) => {
        const { createdAtTo } = (req as IGetCommentsReq).query;

        if (
          createdAtTo &&
          this.isValidDate(value) &&
          this.isValidDate(createdAtTo)
        ) {
          return moment(value).isAfter(moment(createdAtTo));
        }
        return true;
      })
      .withMessage(
        CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE + 'createdAtFrom',
      ),
    query('accounts')
      .optional()
      .custom((value: string | undefined, { req }: Meta) => {
        const { accountType } = (req as IUserReq).user as IUser;

        return (accountType === AccountType.admin && !!value) || !value;
      })
      .withMessage(
        CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE + 'accounts',
      ),
    query('content')
      .optional()
      .isString()
      .withMessage(
        CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE + 'content',
      ),
    query('createdAtTo')
      .optional()
      .custom(this.isValidDate)
      .custom((value: string, { req }: Meta) => {
        const { createdAtFrom } = (req as IGetCommentsReq).query;

        if (
          createdAtFrom &&
          this.isValidDate(value) &&
          this.isValidDate(createdAtFrom)
        ) {
          return moment(value).isBefore(moment(createdAtFrom));
        }
        return true;
      })
      .withMessage(
        CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE + 'createdAtTo',
      ),
    query('productName')
      .optional()
      .custom((value: string | undefined, { req }: Meta) => {
        const { user, query } = req as IGetCommentsReq;
        const { accountType } = user as IUser;
        const { productIds } = query;

        if (accountType === AccountType.member) {
          return !value; // 使用者不可以用 productName 查
        } else if (accountType === AccountType.admin) {
          if (!!productIds && !!value) {
            return false;
          }
        } else {
          return true;
        }
      })
      .withMessage(
        CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE + 'productName',
      ),
    query('productIds')
      .optional()
      .custom((value: string | undefined, { req }: Meta) => {
        const { query } = req as IGetCommentsReq;
        const { productName } = query;
        return !(!!productName && !!value);
      })
      .withMessage(
        CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE + 'productIds',
      ),
    query('sortBy')
      .optional()
      .custom((value: string | undefined) =>
        this.isValidOption(value, 'item', CommentSortBy),
      )
      .withMessage(
        CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE + 'sortBy',
      ),
    this.validationHandler,
  ];
  constructor() {
    super();
  }
}
