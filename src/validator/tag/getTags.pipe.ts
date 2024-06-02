import { query } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';

export class GetTagsPipe extends PipeBase {
  public transform = () => [
    this.limitValidation(
      query('limit'),
      CustomResponseType.INVALID_TAG_FILTER_MESSAGE + 'limit',
    ),
    this.positiveIntValidation(
      query('page'),
      CustomResponseType.INVALID_TAG_FILTER_MESSAGE + 'page',
    ),
    query('name')
      .optional()
      .trim()
      .isString()
      .withMessage(CustomResponseType.INVALID_TAG_FILTER_MESSAGE + 'name'),
    this.validationHandler,
  ];

  constructor() {
    super();
  }
}
