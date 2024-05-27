import { Request } from 'express';
import { GetTagsDTO } from '../dto/tag/getTagsDto';
import { TagService } from '../service/tagService';
import { CustomResponseType } from '../types/customResponseType';
import { ICreateTagReq, IGetTagsReq } from '../types/tag.type';
import { BaseController } from './baseController';
import { EditTagDTO } from '../dto/tag/editTagDto';
import { GetTagVo } from '../vo/tag/getTagVo';

export class TagController extends BaseController {
  private readonly tagService = new TagService();

  public readonly getTags = async (req: IGetTagsReq) => {
    const getTagsDto = new GetTagsDTO(req);
    const tags = await this.tagService.getTags(getTagsDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      new GetTagVo(tags),
    );
  };

  public readonly createTag = async (req: ICreateTagReq) => {
    const tag = await this.tagService.createTag(req.body.name);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      { tag },
    );
  };

  public readonly editTag = async (req: ICreateTagReq) => {
    const editTagDto = new EditTagDTO(req);
    const tag = await this.tagService.editTag(editTagDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      { tag },
    );
  };

  public readonly deleteTag = async (req: Request) => {
    const tag = await this.tagService.deleteTag(req.params.tagId);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      { tag },
    );
  };
}
