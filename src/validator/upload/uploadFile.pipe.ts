import { param } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { FileCategory, FileType } from '../../types/upload.type';
import { CustomResponseType } from '../../types/customResponseType';

export class UploadFilePipe extends PipeBase {
  private isValidType = (value: string) =>
    Object.keys(FileType).includes(value);

  private isValidCategory = (value: string) =>
    Object.keys(FileCategory).includes(value);

  public transform() {
    return [
      param('type')
        .exists()
        .custom(this.isValidType)
        .withMessage(CustomResponseType.FORMAT_ERROR + 'type'),
      param('category')
        .exists()
        .custom(this.isValidCategory)
        .withMessage(CustomResponseType.FORMAT_ERROR + 'category'),
      this.validationHandler,
    ];
  }

  constructor() {
    super();
  }
}
