import { PipeBase } from '../pipe.base';
import { body } from 'express-validator';
import { CustomResponseType } from '../../types/customResponseType';

export class JoinGroupPipe extends PipeBase {
  public transform() {
    return [
      body('name')
        .exists()
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '姓名'),
      body('nickname')
        .exists()
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '暱稱'),
      body('phone')
        .exists()
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '電話'),
      body('lineId')
        .exists()
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + 'Line ID'),
      this.validationHandler,
    ];
  }

  constructor() {
    super();
  }
}
