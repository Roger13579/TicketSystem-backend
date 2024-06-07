import { PipeBase } from '../pipe.base';
import { body } from 'express-validator';
import { CustomResponseType } from '../../types/customResponseType';

export class GoogleUpdatePipe extends PipeBase {
  public transform() {
    return [
      body('account')
        .exists()
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '帳號'),
      body('pwd')
        .exists()
        .isLength({ min: 8 })
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '密碼'),
      body('confirmPwd')
        .exists()
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + 'confirmPwd')
        .custom(this.validateConfirmPwd)
        .withMessage(
          CustomResponseType.FORMAT_ERROR_MESSAGE + '密碼與確認密碼不同',
        ),
      this.validationHandler,
    ];
  }
  constructor() {
    super();
  }
}
