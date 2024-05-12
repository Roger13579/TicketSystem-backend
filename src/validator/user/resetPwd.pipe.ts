import { PipeBase } from '../pipe.base';
import { body } from 'express-validator';
import { CustomResponseType } from '../../types/customResponseType';

export class ResetPwdPipe extends PipeBase {
  public transform() {
    return [
      body('oldPwd')
        .isLength({ min: 8 })
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '密碼'),
      body('pwd')
        .exists()
        .isLength({ min: 8 })
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '密碼'),
      body('confirmPwd').exists(),
      this.validationHandler,
    ];
  }
  constructor() {
    super();
  }
}
