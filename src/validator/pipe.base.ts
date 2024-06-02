import { NextFunction } from 'express';
import { Meta, ValidationChain, validationResult } from 'express-validator';
import { CustomResponseType } from '../types/customResponseType';
import { throwError } from '../utils/errorHandler';
import { includes, keys } from 'lodash';
import { AccountType } from '../types/user.type';
import { OptionType, TCustomValidator } from './index.type';
import moment from 'moment';

export const booleanStrings = ['true', 'false'];

export abstract class PipeBase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public abstract transform(): any;

  /**
   * 驗證：管理者可以使用，非管理者完全不可使用
   * @description 使用時請放在 optional() 後面
   */
  protected isAdminOnly: TCustomValidator = (value, { req }) =>
    (req.user && req.user.accountType === AccountType.admin) || !value;

  /**
   * 驗證：非管理者則必須給特定值
   * @description 使用時必須放到 chain 的最上面，再接 optional()
   */
  protected validateMemberSpecific =
    (target: unknown) =>
    (value: string, { req }: Meta) =>
      (req.user && req.user.accountType === AccountType.admin) ||
      value === target;

  /**
   * 驗證：非管理者一定要給，管理者則不一定
   * @description 使用時必須放到 chain 的最上面，再接 optional()
   */
  protected isMemberMust: TCustomValidator = (value, { req }) =>
    (req.user && req.user.accountType === AccountType.admin) || !!value;

  /**
   * 驗證：未登入者一定要給
   * @description 使用時必須放到 chain 的最上面，再接 optional()
   */
  protected isNoLoginMust: TCustomValidator = (value, { req }) =>
    (req.user && req.user._id) || !!value;

  /**
   * @description 驗證為 valid 日期
   */
  protected validateDate = (value: string) => {
    const date = new Date(value);
    return date instanceof Date && !isNaN(date.getTime());
  };

  protected validationHandler(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const arr = errors.array();
      throwError(arr[0].msg, CustomResponseType.FORMAT_ERROR);
    }
    next();
  }

  /**
   * @description 驗證為正整數
   */
  protected positiveIntValidation = (chain: ValidationChain, message: string) =>
    chain
      .exists()
      .withMessage(message)
      .toInt()
      .isInt({ min: 1 })
      .withMessage(message);

  /**
   * @description 必有內容的 string
   */
  protected nonEmptyStringValidation = (
    chain: ValidationChain,
    message: string,
  ) =>
    chain
      .exists()
      .withMessage(message)
      .isString()
      .withMessage(message)
      .trim()
      .notEmpty()
      .withMessage(message);

  /**
   * @description 驗證為 valid 選項
   */
  protected validateOption =
    (type: OptionType, reference: object): TCustomValidator =>
    (value?: string) => {
      if (!value) {
        return true;
      }
      const referenceKeys = keys(reference);
      switch (type) {
        case OptionType.item:
          return includes(referenceKeys, value.replace('-', ''));
        case OptionType.array:
          return value
            .split(',')
            .every((item) => includes(referenceKeys, item));
        default:
          return false;
      }
    };

  /**
   * @description 針對 limit 的驗證，必為 1 ~ 100 的正整數
   */
  protected limitValidation = (chain: ValidationChain, message: string) =>
    chain
      .custom(this.isMemberMust)
      .withMessage(message)
      .optional()
      .withMessage(message)
      .toInt()
      .isInt({ min: 1, max: 100 })
      .withMessage(message);

  /**
   * @description 驗證兩個日期之間的關係 by moment
   */
  protected validatePeriod = (
    value: string | undefined,
    fromValue: string | undefined,
    compareFn: (a: moment.Moment, b: moment.Moment) => boolean,
  ): boolean => {
    const isNeedCheckPeriod =
      value &&
      fromValue &&
      this.validateDate(value) &&
      this.validateDate(fromValue);

    return isNeedCheckPeriod
      ? compareFn(moment(value), moment(fromValue))
      : true;
  };

  /**
   * 驗證：多個屬性不可同時存在
   * @param propNames - 需要檢查的屬性名稱數組
   */
  validateExclusiveProps =
    (...propNames: string[]): TCustomValidator =>
    (_value, { req: { query } }) => {
      if (!query) {
        return true;
      }

      const values = propNames.map((name) => query[name]).filter(Boolean);

      // 如何處理兩個都沒有的情況
      return values.length < 2;
    };

  protected constructor() {}
}
