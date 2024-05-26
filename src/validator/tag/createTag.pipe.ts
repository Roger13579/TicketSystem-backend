import { body } from 'express-validator';
import { CustomResponseType } from '../../types/customResponseType';
import { PipeBase } from '../pipe.base';

export class CreateTagPipe extends PipeBase {
  public transform = () => [
    body('name')
      .exists()
      .trim()
      .isString()
      .isLength({ min: 1 })
      .withMessage(CustomResponseType.INSERT_ERROR_MESSAGE + 'name'),
    this.validationHandler,
  ];
  constructor() {
    super();
  }
}
