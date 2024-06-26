import { PipeBase } from '../pipe.base';
import { body } from 'express-validator';
import { CustomResponseType } from '../../types/customResponseType';

export class LoginPipe extends PipeBase {
  public transform() {
    return [
      body('account')
        .exists()
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '帳號'),
      body('pwd')
        .exists()
        .isLength({ min: 8 })
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '密碼'),
      this.validationHandler,
    ];
  }
  constructor() {
    super();
  }
}
