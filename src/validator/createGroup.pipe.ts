import { PipeBase } from './pipe.base';
import { body } from 'express-validator';
import { CustomResponseType } from '../types/customResponseType';

export class CreateGroupPipe extends PipeBase {
  public transform(): any[] {
    return [
      body('title')
        .exists()
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '活動標題'),
      body('location')
        .exists()
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '活動地點'),
      body('movieTitle')
        .exists()
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '電影名稱'),
      body('time')
        .exists()
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '活動時間'),
      body('amount')
        .exists()
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '人數'),
      body('haveTicket')
        .exists()
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '是否持有票券'),
      this.validationHandler,
    ];
  }
}
