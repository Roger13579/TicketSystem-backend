import { PipeBase } from '../pipe.base';
import { body } from 'express-validator';
import { CustomResponseType } from '../../types/customResponseType';

export class CreateGroupPipe extends PipeBase {
  public transform() {
    return [
      this.nonEmptyStringValidation(
        body('title'),
        CustomResponseType.FORMAT_ERROR_MESSAGE + '活動標題',
      ),
      body('placeholderImg')
        .exists()
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '活動圖片'),
      this.nonEmptyStringValidation(
        body('theater'),
        CustomResponseType.FORMAT_ERROR_MESSAGE + '活動地點',
      ),
      this.nonEmptyStringValidation(
        body('movieTitle'),
        CustomResponseType.FORMAT_ERROR_MESSAGE + '電影名稱',
      ),
      body('time')
        .exists()
        .custom(this.validateDate)
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '活動時間'),
      this.positiveIntValidation(
        body('amount'),
        CustomResponseType.FORMAT_ERROR_MESSAGE + '人數',
      ),
      body('haveTicket')
        .exists()
        .isBoolean()
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '是否持有票券'),
      this.validationHandler,
    ];
  }

  constructor() {
    super();
  }
}
