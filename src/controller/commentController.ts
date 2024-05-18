import { NextFunction, Response } from 'express';
import { NewCommentDTO } from '../dto/comment/newCommentDto';
import { CommentService } from '../service/commentService';
import {
  ICommentProductReq,
  IDeleteCommentsReq,
  IGetCommentsReq,
} from '../types/comment.type';
import { CustomResponseType } from '../types/customResponseType';
import { BaseController } from './baseController';
import { GetCommentsDTO } from '../dto/comment/getCommentsDto';
import { GetCommentsVo } from '../vo/comment/getCommentsVo';

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

  public readonly deleteComments = async (
    req: IDeleteCommentsReq,
    res: Response,
    next: NextFunction,
  ) => {
    const info = await this.commentService.deleteComments(
      req.body.commentIds,
      next,
    );
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      info ? { deletedCount: info.deletedCount } : {},
    );
  };

  public readonly getComments = async (req: IGetCommentsReq) => {
    const getCommentsDto = new GetCommentsDTO(req);
    const { page, limit } = getCommentsDto;
    const info = await this.commentService.getComments(getCommentsDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      new GetCommentsVo(info, page, limit),
    );
  };
}
