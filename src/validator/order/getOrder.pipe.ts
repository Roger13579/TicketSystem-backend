import { PipeBase } from '../pipe.base';
import { query } from 'express-validator';
import { CustomResponseType } from '../../types/customResponseType';
import {
  IGetOrdersReq,
  OrderSortField,
  PaymentStatus,
} from '../../types/order.type';
import { OptionType, TCustomValidator } from '../index.type';
import { SortOrder } from '../../types/common.type';

// 管理者和使用者都可以使用的

export class GetOrderPipe extends PipeBase {
  private validateCreatedAtFrom: TCustomValidator = (value, { req }) => {
    const { createdAtTo } = (req as IGetOrdersReq).query;
    return this.validatePeriod(value, createdAtTo, (a, b) =>
      b.isSameOrAfter(a),
    );
  };

  private validateCreatedAtTo: TCustomValidator = (value, { req }) => {
    const { createdAtFrom } = (req as IGetOrdersReq).query;
    return this.validatePeriod(value, createdAtFrom, (a, b) =>
      b.isSameOrBefore(a),
    );
  };

  private validatePaidAtFrom: TCustomValidator = (value, { req }) => {
    const { paidAtTo } = (req as IGetOrdersReq).query;
    return this.validatePeriod(value, paidAtTo, (a, b) => b.isSameOrAfter(a));
  };

  private validatePaidAtTo: TCustomValidator = (value, { req }) => {
    const { paidAtFrom } = (req as IGetOrdersReq).query;
    return this.validatePeriod(value, paidAtFrom, (a, b) =>
      b.isSameOrBefore(a),
    );
  };

  public transform = () => [
    this.limitValidation(
      query('limit'),
      CustomResponseType.INVALID_ORDER_FILTER_MESSAGE + 'limit',
    ),
    this.positiveIntValidation(
      query('page'),
      CustomResponseType.INVALID_ORDER_FILTER_MESSAGE + 'page',
    ),
    query('ids')
      .optional()
      .isString()
      .withMessage(CustomResponseType.INVALID_ORDER_FILTER_MESSAGE + 'ids'),
    query('thirdPartyPaymentIds')
      .optional()
      .isString()
      .withMessage(
        CustomResponseType.INVALID_ORDER_FILTER_MESSAGE +
          'thirdPartyPaymentIds',
      ),
    query('accounts')
      .optional()
      .custom(this.isAdminOnly)
      .withMessage(
        CustomResponseType.INVALID_ORDER_FILTER_MESSAGE +
          CustomResponseType.PERMISSION_DENIED_MESSAGE +
          'accounts',
      ),
    query('emails')
      .optional()
      .custom(this.isAdminOnly)
      .withMessage(
        CustomResponseType.INVALID_ORDER_FILTER_MESSAGE +
          CustomResponseType.PERMISSION_DENIED_MESSAGE +
          'emails',
      ),
    query('phones')
      .optional()
      .custom(this.isAdminOnly)
      .withMessage(
        CustomResponseType.INVALID_ORDER_FILTER_MESSAGE +
          CustomResponseType.PERMISSION_DENIED_MESSAGE +
          'phones',
      ),
    query('status')
      .optional()
      .isIn(Object.keys(PaymentStatus))
      .withMessage(CustomResponseType.INVALID_ORDER_FILTER_MESSAGE + 'status'),
    query('createdAtFrom')
      .optional()
      .custom(this.validateDate)
      .withMessage(
        CustomResponseType.INVALID_ORDER_FILTER_MESSAGE + 'createdAtTo',
      )
      .custom(this.validateCreatedAtFrom)
      .withMessage(
        CustomResponseType.INVALID_ORDER_FILTER_MESSAGE + 'createdAtFrom',
      ),
    query('createdAtTo')
      .optional()
      .custom(this.validateDate)
      .withMessage(
        CustomResponseType.INVALID_ORDER_FILTER_MESSAGE + 'createdAtTo',
      )
      .custom(this.validateCreatedAtTo)
      .withMessage(
        CustomResponseType.INVALID_ORDER_FILTER_MESSAGE + 'createdAtTo',
      ),
    query('paidAtFrom')
      .optional()
      .custom(this.validateDate)
      .withMessage(
        CustomResponseType.INVALID_ORDER_FILTER_MESSAGE + 'paidAtFrom',
      )
      .custom(this.validatePaidAtFrom)
      .withMessage(
        CustomResponseType.INVALID_ORDER_FILTER_MESSAGE + 'paidAtFrom',
      ),
    query('paidAtTo')
      .optional()
      .custom(this.validateDate)
      .withMessage(CustomResponseType.INVALID_ORDER_FILTER_MESSAGE + 'paidAtTo')
      .custom(this.validatePaidAtTo)
      .withMessage(
        CustomResponseType.INVALID_ORDER_FILTER_MESSAGE + 'paidAtTo',
      ),
    query('sortField')
      .optional()
      .custom(this.validateOption(OptionType.item, OrderSortField))
      .withMessage(
        CustomResponseType.INVALID_ORDER_FILTER_MESSAGE + 'sortField',
      ),
    query('sortOrder')
      .optional()
      .custom(this.validateOption(OptionType.item, SortOrder))
      .withMessage(
        CustomResponseType.INVALID_ORDER_FILTER_MESSAGE + 'sortOrder',
      ),
    this.validationHandler,
  ];

  constructor() {
    super();
  }
}
