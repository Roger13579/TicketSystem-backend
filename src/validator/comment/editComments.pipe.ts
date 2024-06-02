import { body } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';
import { Status } from '../../types/common.type';

export class EditCommentsPipe extends PipeBase {
  public transform = () => [
    body('comments.*.id')
      .exists()
      .isString()
      .withMessage(CustomResponseType.EDIT_COMMENT_ERROR_MESSAGE + 'id'),
    body('comments.*.status')
      .exists()
      .isIn(Object.keys(Status))
      .withMessage(CustomResponseType.EDIT_COMMENT_ERROR_MESSAGE + 'status'),
    this.validationHandler,
  ];
  constructor() {
    super();
  }
}
