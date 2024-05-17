import { NextFunction } from 'express';
import { NewCommentDTO } from '../dto/newCommentDto';
import { CommentRepository } from '../repository/commentRepository';
import { throwError } from '../utils/errorHandler';
import { CustomResponseType } from '../types/customResponseType';

export class CommentService {
  private readonly commentRepository: CommentRepository =
    new CommentRepository();

  public commentProduct = async (
    newCommentDto: NewCommentDTO,
    next: NextFunction,
  ) => {
    return this.commentRepository.createComment(newCommentDto).catch((err) => {
      if (err.name === 'MongoServerError' && err.code === 11000) {
        throwError(
          CustomResponseType.EXISTED_COMMENT_MESSAGE,
          CustomResponseType.EXISTED_COMMENT,
        );
      }
      return next(err);
    });
  };
}
