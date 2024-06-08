import { GetTagsDTO } from '../dto/tag/getTagsDto';
import { TagService } from '../service/tagService';
import { CustomResponseType } from '../types/customResponseType';
import { ICreateTagReq, IGetTagsReq } from '../types/tag.type';
import { BaseController } from './baseController';
import { EditTagDTO } from '../dto/tag/editTagDto';
import { GetTagVo } from '../vo/tag/getTagVo';
import { TMethod } from '../types/common.type';

export class TagController extends BaseController {
  private readonly tagService = new TagService();

  public readonly getTags: TMethod<IGetTagsReq> = async (req) => {
    const getTagsDto = new GetTagsDTO(req);
    const tags = await this.tagService.getTags(getTagsDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      new GetTagVo(tags),
    );
  };

  public readonly createTag: TMethod<ICreateTagReq> = async (req) => {
    const tag = await this.tagService.createTag(req.body.name);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      { tag },
    );
  };

  public readonly editTag: TMethod<ICreateTagReq> = async (req) => {
    const editTagDto = new EditTagDTO(req);
    const tag = await this.tagService.editTag(editTagDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      { tag },
    );
  };

  public readonly deleteTag: TMethod = async (req) => {
    const tag = await this.tagService.deleteTag(req.params.tagId);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      { tag },
    );
  };
}
