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
      .isArray()
      .custom(this.isNotEmptyArray)
      .withMessage(
        CustomResponseType.INVALID_DELETE_COMMENT_MESSAGE + 'commentIds',
      ),
    body('commentIds.*')
      .exists()
      .isString()
      .withMessage(
        CustomResponseType.INVALID_DELETE_COMMENT_MESSAGE + 'commentId',
      ),
    this.validationHandler,
  ];

  constructor() {
    super();
  }
}
