import { NextFunction } from 'express';
import { NewCommentDTO } from '../dto/comment/newCommentDto';
import { CommentRepository } from '../repository/commentRepository';
import { throwError } from '../utils/errorHandler';
import { CustomResponseType } from '../types/customResponseType';
import { GetCommentsDTO } from '../dto/comment/getCommentsDto';
import { Types } from 'mongoose';
import {
  IGetCommentsPagination,
  TCreateInvalidCommentParam,
} from '../types/comment.type';
import { EditCommentsDTO } from '../dto/comment/editCommentsDto';

export class CommentService {
  private readonly commentRepository: CommentRepository =
    new CommentRepository();

  private readonly createInvalidComment: TCreateInvalidCommentParam = (
    comment,
    status,
  ) => {
    let subMessage = '';
    switch (status) {
      case CustomResponseType.INVALID_DELETE_COMMENT:
        subMessage = CustomResponseType.INVALID_DELETE_COMMENT_MESSAGE;
        break;
      case CustomResponseType.EDIT_COMMENT_ERROR:
        subMessage = CustomResponseType.EDIT_COMMENT_ERROR_MESSAGE;
        break;

      default:
        break;
    }
    return {
      comment,
      subStatus: status,
      subMessage,
    };
  };

  public commentProduct = async (
    newCommentDto: NewCommentDTO,
    next: NextFunction,
  ) =>
    await this.commentRepository.createComment(newCommentDto).catch((err) => {
      if (err.name === 'MongoServerError' && err.code === 11000) {
        throwError(
          CustomResponseType.EXISTED_COMMENT_MESSAGE,
          CustomResponseType.EXISTED_COMMENT,
        );
        return;
      }
      return next(err);
    });

  public deleteComments = async (ids: Types.ObjectId[]) => {
    const promises = ids.map(async (id) => {
      const comment = await this.commentRepository.deleteById(id);
      if (!comment) {
        return this.createInvalidComment(
          { commentId: id },
          CustomResponseType.INVALID_DELETE_COMMENT,
        );
      }
      return comment;
    });

    return await Promise.all(promises).then((values) => values);
  };

  public getComments = async (
    getCommentsDto: GetCommentsDTO,
  ): Promise<IGetCommentsPagination> =>
    await this.commentRepository.findComments(getCommentsDto);

  public editComments = async ({ comments }: EditCommentsDTO) => {
    const promises = comments.map(async (comment) => {
      const updatedComment = await this.commentRepository.updateById(comment);
      if (!updatedComment) {
        return this.createInvalidComment(
          comment,
          CustomResponseType.EDIT_COMMENT_ERROR,
        );
      }
      return updatedComment;
    });

    return await Promise.all(promises).then((values) => values);
  };
}
