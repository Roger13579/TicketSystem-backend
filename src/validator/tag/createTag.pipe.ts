import { body } from 'express-validator';
import { CustomResponseType } from '../../types/customResponseType';
import { PipeBase } from '../pipe.base';

export class CreateTagPipe extends PipeBase {
  public transform = () => [
    this.nonEmptyStringValidation(
      body('name'),
      CustomResponseType.INSERT_ERROR_MESSAGE + 'name',
    ),
    this.validationHandler,
  ];
  constructor() {
    super();
  }
}
