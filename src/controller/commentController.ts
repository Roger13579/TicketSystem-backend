import { NextFunction, Response } from 'express';
import { NewCommentDTO } from '../dto/newCommentDto';
import { CommentService } from '../service/commentService';
import { ICommentProductReq } from '../types/comment.type';
import { CustomResponseType } from '../types/customResponseType';
import { BaseController } from './baseController';

export class CommentController extends BaseController {
  private readonly commentService = new CommentService();

  public readonly commentProduct = async (
    req: ICommentProductReq,
    _res: Response,
    next: NextFunction,
  ) => {
    const newCommentDto = new NewCommentDTO(req);
    const comment = await this.commentService.commentProduct(
      newCommentDto,
      next,
    );
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      { comment },
    );
  };
}
