import { EditTagDTO } from '../dto/tag/editTagDto';
import { GetTagsDTO } from '../dto/tag/getTagsDto';
import TagModel from '../models/tag';
import { updateOptions } from '../utils/constants';

export class TagRepository {
  private tagFilter = (getTagsDto: GetTagsDTO) => {
    const { name } = getTagsDto;
    return { ...(name && { name: { $regex: new RegExp(name) } }) };
  };

  public findTags = async (getTagsDto: GetTagsDTO) => {
    const { page, limit } = getTagsDto;
    const filter = this.tagFilter(getTagsDto);
    const options = {
      page,
      limit,
      sortBy: '-createdAt', // TODO:把最常用的顯示在上面
    };
    return await TagModel.paginate(filter, options);
  };

  public deleteTag = async (id: string) => {
    return await TagModel.findOneAndDelete({ _id: id }, updateOptions);
  };

  public createTag = async (name: string) => {
    return await TagModel.findOneAndUpdate(
      { name },
      { $setOnInsert: { name } },
      { new: true, upsert: true, returnDocument: 'after' },
    );
  };

  public updateTag = async (editTagDto: EditTagDTO) => {
    const { tagId, name } = editTagDto;
    return await TagModel.findOneAndUpdate(
      { _id: tagId },
      { name },
      updateOptions,
    );
  };
}
