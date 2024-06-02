import { query } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';
import {
  CommentSortBy,
  IGetCommentsReq,
  RatingRange,
} from '../../types/comment.type';
import { OptionType, TCustomValidator } from '../index.type';
import { Status } from '../../types/common.type';

// 管理者和使用者都可以使用的

export class GetCommentsPipe extends PipeBase {
  private validateCreatedAtFrom: TCustomValidator = (value, { req }) => {
    const { createdAtTo } = (req as IGetCommentsReq).query;
    return this.validatePeriod(value, createdAtTo, (a, b) => a.isAfter(b));
  };

  private validateCreatedAtTo: TCustomValidator = (value, { req }) => {
    const { createdAtFrom } = (req as IGetCommentsReq).query;
    return this.validatePeriod(value, createdAtFrom, (a, b) => a.isBefore(b));
  };

  public transform = () => [
    this.limitValidation(
      query('limit'),
      CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE + 'limit',
    ),
    this.positiveIntValidation(
      query('page'),
      CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE + 'page',
    ),
    query('status')
      .custom(this.validateMemberSpecific(Status.active)) // 非管理者只能看 active 的 comment
      .withMessage(
        CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE +
          CustomResponseType.PERMISSION_DENIED_MESSAGE +
          'status',
      )
      .optional()
      .isIn(Object.keys(Status))
      .withMessage(
        CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE + 'status',
      ),
    query('ratings')
      .optional()
      .custom(this.validateOption(OptionType.array, RatingRange))
      .withMessage(
        CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE + 'rating',
      ),
    query('createdAtFrom')
      .optional()
      .custom(this.validateDate) // 確定為 valid Date
      .withMessage(
        CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE + 'createdAtFrom',
      )
      .custom(this.validateCreatedAtFrom)
      .withMessage(
        CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE + 'createdAtFrom',
      ),
    query('accounts')
      .optional()
      .custom(this.isAdminOnly)
      .withMessage(
        CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE +
          CustomResponseType.PERMISSION_DENIED_MESSAGE +
          'accounts',
      ),
    query('content')
      .optional()
      .custom(this.isAdminOnly)
      .withMessage(
        CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE +
          CustomResponseType.PERMISSION_DENIED_MESSAGE +
          'content',
      )
      .isString()
      .withMessage(
        CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE + 'content',
      ),
    query('createdAtTo')
      .optional()
      .custom(this.validateDate)
      .custom(this.validateCreatedAtTo)
      .withMessage(
        CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE + 'createdAtTo',
      ),
    query('productName') // 只有管理者可以用這個搜
      .optional()
      .custom(this.isAdminOnly)
      .withMessage(
        CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE +
          CustomResponseType.PERMISSION_DENIED_MESSAGE +
          'productName',
      )
      .custom(this.validateExclusiveProps('productIds', 'productName'))
      .withMessage(
        CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE +
          'productIds 和 productName 不可以同時使用',
      ),
    query('productIds')
      .custom(this.isMemberMust)
      .withMessage(
        CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE + 'productIds',
      )
      .custom(this.validateExclusiveProps('productIds', 'productName'))
      .withMessage(
        CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE +
          'productIds 和 productName 不可以同時使用',
      ),
    query('sortBy')
      .optional()
      .custom(this.validateOption(OptionType.item, CommentSortBy))
      .withMessage(
        CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE + 'sortBy',
      ),
    this.validationHandler,
  ];
  constructor() {
    super();
  }
}
