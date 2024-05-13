import { PipeBase } from '../pipe.base';
import { body } from 'express-validator';
import { CustomResponseType } from '../../types/customResponseType';

export class UpdateGroupPipe extends PipeBase {
  public transform() {
    return [
      body('title')
        .exists()
        .isLength({ min: 1 })
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '活動標題'),
      this.validationHandler,
    ];
  }

  constructor() {
    super();
  }
}
