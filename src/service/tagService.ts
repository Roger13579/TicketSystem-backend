import { EditTagDTO } from '../dto/tag/editTagDto';
import { GetTagsDTO } from '../dto/tag/getTagsDto';
import { TagRepository } from '../repository/tagRepository';
import { CustomResponseType } from '../types/customResponseType';
import { throwError } from '../utils/errorHandler';

export class TagService {
  private readonly tagRepository: TagRepository = new TagRepository();

  public getTags = async (getTagsDto: GetTagsDTO) =>
    await this.tagRepository.findTags(getTagsDto);

  public deleteTag = async (id: string) => {
    const deletedTag = await this.tagRepository.deleteTag(id);

    if (!deletedTag) {
      throwError(
        CustomResponseType.DELETE_ERROR_MESSAGE,
        CustomResponseType.DELETE_ERROR,
      );
      return;
    }

    return deletedTag;
  };

  public createTag = async (name: string) =>
    await this.tagRepository.createTag(name);

  public editTag = async (editTagDto: EditTagDTO) => {
    const editedTag = await this.tagRepository.updateTag(editTagDto);

    if (!editedTag) {
      throwError(
        CustomResponseType.UPDATE_ERROR_MESSAGE,
        CustomResponseType.UPDATE_ERROR,
      );
      return;
    }

    return editedTag;
  };
}
