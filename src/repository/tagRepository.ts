import { EditTagDTO } from '../dto/tag/editTagDto';
import { GetTagsDTO } from '../dto/tag/getTagsDto';
import TagModel from '../models/tag';

import { updateOptions } from '../utils/constants';

export class TagRepository {
  public findTags = async ({ filter, options }: GetTagsDTO) =>
    await TagModel.paginate(filter, options);

  public deleteTag = async (id: string) =>
    await TagModel.findOneAndDelete({ _id: id }, updateOptions);

  public createTag = async (name: string) =>
    await TagModel.findOneAndUpdate(
      { name },
      { $setOnInsert: { name } },
      { new: true, upsert: true, returnDocument: 'after' },
    );

  public updateTag = async ({ tagId, name }: EditTagDTO) =>
    await TagModel.findOneAndUpdate({ _id: tagId }, { name }, updateOptions);
}
