import { query } from 'express-validator';
import { CustomResponseType } from '../../types/customResponseType';
import { PipeBase } from '../pipe.base';

export class GetUserFavoritePipe extends PipeBase {
  public transform = () => [
    this.limitValidation(
      query('limit'),
      CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE + 'limit',
    ),
    this.positiveIntValidation(
      query('page'),
      CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE + 'page',
    ),
    this.validationHandler,
  ];
  constructor() {
    super();
  }
}
