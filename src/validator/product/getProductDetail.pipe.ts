import { param } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';

export class GetProductDetailPipe extends PipeBase {
  public transform() {
    return [
      param('id')
        .exists()
        .withMessage(CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'id'),
      this.validationHandler,
    ];
  }
  constructor() {
    super();
  }
}
