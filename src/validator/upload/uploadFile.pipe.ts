import { param } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { FileCategory, FileType } from '../../types/upload.type';
import { CustomResponseType } from '../../types/customResponseType';

export class UploadFilePipe extends PipeBase {
  public transform() {
    return [
      param('type')
        .exists()
        .custom((value: string) => {
          const isValid = Object.keys(FileType).includes(value);
          if (!isValid) {
            throw new Error(CustomResponseType.FORMAT_ERROR + 'type');
          }
          return true;
        }),
      param('category')
        .exists()
        .custom((value: string) => {
          const isValid = Object.keys(FileCategory).includes(value);
          if (!isValid) {
            throw new Error(CustomResponseType.FORMAT_ERROR + 'category');
          }
          return true;
        }),
      this.validationHandler,
    ];
  }

  constructor() {
    super();
  }
}
