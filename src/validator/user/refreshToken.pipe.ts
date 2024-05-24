import { PipeBase } from '../pipe.base';
import { body } from 'express-validator';
import { CustomResponseType } from '../../types/customResponseType';

export class RefreshTokenPipe extends PipeBase {
  public transform() {
    return [
      body('refreshToken')
        .exists()
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + 'refreshToken'),
      this.validationHandler,
    ];
  }
  constructor() {
    super();
  }
}
