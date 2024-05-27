import { query } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';

export class GetTagsPipe extends PipeBase {
  public transform = () => [
    query('limit')
      .exists()
      .toInt()
      .withMessage(CustomResponseType.INVALID_TAG_FILTER_MESSAGE + 'limit')
      .isInt({ min: 1 })
      .withMessage(CustomResponseType.INVALID_TAG_FILTER_MESSAGE + 'limit'),
    query('page')
      .exists()
      .toInt()
      .withMessage(CustomResponseType.INVALID_TAG_FILTER_MESSAGE + 'page')
      .isInt({ min: 1 })
      .withMessage(CustomResponseType.INVALID_TAG_FILTER_MESSAGE + 'page'),
    query('name')
      .optional()
      .isString()
      .withMessage(CustomResponseType.INVALID_TAG_FILTER_MESSAGE + 'name'),
    this.validationHandler,
  ];

  constructor() {
    super();
  }
}
