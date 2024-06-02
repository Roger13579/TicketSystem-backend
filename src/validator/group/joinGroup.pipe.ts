import { PipeBase } from '../pipe.base';
import { body } from 'express-validator';
import { CustomResponseType } from '../../types/customResponseType';

export class JoinGroupPipe extends PipeBase {
  public transform() {
    return [
      this.nonEmptyStringValidation(
        body('name'),
        CustomResponseType.FORMAT_ERROR_MESSAGE + '姓名',
      ),
      this.nonEmptyStringValidation(
        body('nickname'),
        CustomResponseType.FORMAT_ERROR_MESSAGE + '暱稱',
      ),
      this.nonEmptyStringValidation(
        body('phone'),
        CustomResponseType.FORMAT_ERROR_MESSAGE + '電話',
      ),
      this.nonEmptyStringValidation(
        body('lineId'),
        CustomResponseType.FORMAT_ERROR_MESSAGE + 'Line ID',
      ),
      this.validationHandler,
    ];
  }

  constructor() {
    super();
  }
}
