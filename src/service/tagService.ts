import { EditTagDTO } from '../dto/tag/editTagDto';
import { GetTagsDTO } from '../dto/tag/getTagsDto';
import { ProductRepository } from '../repository/productRepository';
import { TagRepository } from '../repository/tagRepository';
import { CustomResponseType } from '../types/customResponseType';
import { throwError } from '../utils/errorHandler';

export class TagService {
  private readonly tagRepository: TagRepository = new TagRepository();
  private readonly productRepository: ProductRepository =
    new ProductRepository();

  public getTags = async (getTagsDto: GetTagsDTO) =>
    await this.tagRepository.findTags(getTagsDto);

  public deleteTag = async (id: string) => {
    // TODO: 優化確認沒有 product 使用

    const isUsed = await this.productRepository.findProduct({
      'tags._id': id,
    });

    if (!isUsed) {
      throwError(
        CustomResponseType.DELETE_ERROR_MESSAGE + '標籤正在使用',
        CustomResponseType.DELETE_ERROR,
      );
      return;
    }

    const deletedTag = await this.tagRepository.deleteTag(id);

    if (!deletedTag) {
      throwError(
        CustomResponseType.DELETE_ERROR_MESSAGE + '標籤不存在',
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
