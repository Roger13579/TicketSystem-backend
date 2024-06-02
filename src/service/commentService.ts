import { NextFunction } from 'express';
import { NewCommentDTO } from '../dto/comment/newCommentDto';
import { CommentRepository } from '../repository/commentRepository';
import { throwError } from '../utils/errorHandler';
import { CustomResponseType } from '../types/customResponseType';
import { GetCommentsDTO } from '../dto/comment/getCommentsDto';
import { Types } from 'mongoose';
import { IGetCommentsRes } from '../types/comment.type';
import { EditCommentsDTO } from '../dto/comment/editCommentsDto';

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

  public deleteComments = async (ids: Types.ObjectId[]) => {
    const deletedComments =
      await this.commentRepository.deleteCommentsById(ids);

    const hasInvalidComment = deletedComments.some(
      (comment) => comment === null,
    );

    if (hasInvalidComment) {
      throwError(
        CustomResponseType.INVALID_DELETE_COMMENT_MESSAGE,
        CustomResponseType.INVALID_DELETE_COMMENT,
      );
    }

    return deletedComments;
  };

  public getComments = async (
    getCommentsDto: GetCommentsDTO,
  ): Promise<IGetCommentsRes[]> =>
    await this.commentRepository.findComments(getCommentsDto);

  public editComments = async (editCommentDto: EditCommentsDTO) => {
    const comments = await this.commentRepository.editComments(editCommentDto);

    const hasInvalidComment = comments.some((comment) => comment === null);

    if (hasInvalidComment) {
      throwError(
        CustomResponseType.EDIT_COMMENT_ERROR_MESSAGE,
        CustomResponseType.EDIT_COMMENT_ERROR,
      );
    }
    return comments;
  };
}
