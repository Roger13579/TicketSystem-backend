import { PipeBase } from '../pipe.base';
import { body } from 'express-validator';
import { CustomResponseType } from '../../types/customResponseType';

export class UpdateGroupPipe extends PipeBase {
  public transform() {
    return [
      this.nonEmptyStringValidation(
        body('title'),
        CustomResponseType.FORMAT_ERROR_MESSAGE + '活動標題',
      ),
      this.validationHandler,
    ];
  }

  constructor() {
    super();
  }
}
