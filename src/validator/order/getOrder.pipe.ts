import { PipeBase } from '../pipe.base';
import { query } from 'express-validator';
import { CustomResponseType } from '../../types/customResponseType';
import {
  IGetOrdersReq,
  OrderSortBy,
  PaymentStatus,
} from '../../types/order.type';
import { OptionType, TCustomValidator } from '../index.type';

// 管理者和使用者都可以使用的

export class GetOrderPipe extends PipeBase {
  private validateCreatedAtFrom: TCustomValidator = (value, { req }) => {
    const { createdAtTo } = (req as IGetOrdersReq).query;
    return this.validatePeriod(value, createdAtTo, (a, b) => b.isAfter(a));
  };

  private validateCreatedAtTo: TCustomValidator = (value, { req }) => {
    const { createdAtFrom } = (req as IGetOrdersReq).query;
    return this.validatePeriod(value, createdAtFrom, (a, b) => a.isBefore(b));
  };

  private validatePaidAtFrom: TCustomValidator = (value, { req }) => {
    const { paidAtTo } = (req as IGetOrdersReq).query;
    return this.validatePeriod(value, paidAtTo, (a, b) => b.isAfter(a));
  };

  private validatePaidAtTo: TCustomValidator = (value, { req }) => {
    const { paidAtFrom } = (req as IGetOrdersReq).query;
    return this.validatePeriod(value, paidAtFrom, (a, b) => a.isBefore(b));
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
      .custom(this.isAdminOnly)
      .withMessage(
        CustomResponseType.INVALID_ORDER_FILTER_MESSAGE +
          CustomResponseType.PERMISSION_DENIED_MESSAGE +
          'ids',
      ),
    query('thirdPartyPaymentIds')
      .custom(this.isAdminOnly)
      .withMessage(
        CustomResponseType.INVALID_ORDER_FILTER_MESSAGE +
          CustomResponseType.PERMISSION_DENIED_MESSAGE +
          'thirdPartyPaymentIds',
      ),
    query('accounts')
      .custom(this.isAdminOnly)
      .withMessage(
        CustomResponseType.INVALID_ORDER_FILTER_MESSAGE +
          CustomResponseType.PERMISSION_DENIED_MESSAGE +
          'accounts',
      ),
    query('emails')
      .custom(this.isAdminOnly)
      .withMessage(
        CustomResponseType.INVALID_ORDER_FILTER_MESSAGE +
          CustomResponseType.PERMISSION_DENIED_MESSAGE +
          'emails',
      ),
    query('phones')
      .custom(this.isAdminOnly)
      .withMessage(
        CustomResponseType.INVALID_ORDER_FILTER_MESSAGE +
          CustomResponseType.PERMISSION_DENIED_MESSAGE +
          'phones',
      ),
    query('sortBy')
      .optional()
      .custom(this.validateOption(OptionType.item, OrderSortBy))
      .withMessage(CustomResponseType.INVALID_ORDER_FILTER_MESSAGE + 'sortBy'),
    query('status')
      .optional()
      .isIn(Object.keys(PaymentStatus))
      .withMessage(CustomResponseType.INVALID_ORDER_FILTER_MESSAGE + 'status'),
    query('createdAtFrom')
      .optional()
      .custom(this.validateDate)
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
    this.validationHandler,
  ];

  constructor() {
    super();
  }
}
