import { param } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { FileCategory, FileType } from '../../types/upload.type';
import { CustomResponseType } from '../../types/customResponseType';
import { OptionType } from '../index.type';

export class UploadFilePipe extends PipeBase {
  public transform = () => [
    param('type')
      .exists()
      .custom(this.validateOption(OptionType.item, FileType))
      .withMessage(CustomResponseType.FORMAT_ERROR + 'type'),
    param('category')
      .exists()
      .custom(this.validateOption(OptionType.item, FileCategory))
      .withMessage(CustomResponseType.FORMAT_ERROR + 'category'),
    this.validationHandler,
  ];

  constructor() {
    super();
  }
}
