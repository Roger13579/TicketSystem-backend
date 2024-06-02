import { body } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';

export class DeleteCommentsPipe extends PipeBase {
  public transform = () => [
    body('commentIds')
      .exists()
      .withMessage(
        CustomResponseType.INVALID_DELETE_COMMENT_MESSAGE + 'commentIds',
      )
      .isArray({ min: 1 })
      .withMessage(
        CustomResponseType.INVALID_DELETE_COMMENT_MESSAGE + 'commentIds',
      ),
    this.nonEmptyStringValidation(
      body('commentIds.*'),
      CustomResponseType.INVALID_DELETE_COMMENT_MESSAGE + 'commentId',
    ),
    this.validationHandler,
  ];

  constructor() {
    super();
  }
}
