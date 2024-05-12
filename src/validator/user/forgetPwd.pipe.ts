import { PipeBase } from '../pipe.base';
import { body } from 'express-validator';
import { CustomResponseType } from '../../types/customResponseType';

export class ForgetPwdPipe extends PipeBase {
  public transform() {
    return [
      body('email')
        .exists()
        .isEmail()
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '電子信箱'),
      this.validationHandler,
    ];
  }
  constructor() {
    super();
  }
}
