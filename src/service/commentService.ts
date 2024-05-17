import { NextFunction } from 'express';
import { NewCommentDTO } from '../dto/comment/newCommentDto';
import { CommentRepository } from '../repository/commentRepository';
import { throwError } from '../utils/errorHandler';
import { CustomResponseType } from '../types/customResponseType';
import { GetCommentsDTO } from '../dto/comment/getCommentsDto';

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
        return;
      }
      return next(err);
    });
  };

  public deleteComments = async (ids: string[], next: NextFunction) => {
    return await this.commentRepository.deleteComments(ids).catch((err) => {
      if (err.name === 'CastError') {
        throwError(
          CustomResponseType.INVALID_DELETE_COMMENT_MESSAGE + 'commentId',
          CustomResponseType.INVALID_DELETE_COMMENT,
        );
        return;
      }
      return next(err);
    });
  };

  public getComments = async (getCommentsDto: GetCommentsDTO) => {
    const comments = await this.commentRepository.findComments(getCommentsDto);
    const totalCount =
      await this.commentRepository.countComments(getCommentsDto);
    return { comments, totalCount };
  };
}
