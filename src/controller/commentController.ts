import { NextFunction, Response } from 'express';
import { NewCommentDTO } from '../dto/comment/newCommentDto';
import { CommentService } from '../service/commentService';
import {
  ICommentProductReq,
  IDeleteCommentsReq,
  IEditCommentsReq,
  IGetCommentsReq,
} from '../types/comment.type';
import { CustomResponseType } from '../types/customResponseType';
import { BaseController } from './baseController';
import { GetCommentsDTO } from '../dto/comment/getCommentsDto';
import { GetCommentsVo } from '../vo/comment/getCommentsVo';
import { EditCommentsDTO } from '../dto/comment/editCommentsDto';
import { UpdateCommentsVo } from '../vo/comment/updateCommentsVo';

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

  public readonly deleteComments = async ({
    body: { commentIds },
  }: IDeleteCommentsReq) => {
    const infos = await this.commentService.deleteComments(commentIds);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      new UpdateCommentsVo(infos),
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

  public readonly editComments = async (req: IEditCommentsReq) => {
    const editCommentDto = new EditCommentsDTO(req);
    const infos = await this.commentService.editComments(editCommentDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      new UpdateCommentsVo(infos),
    );
  };
}
