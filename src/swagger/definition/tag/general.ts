import { CustomResponseType } from '../../../types/customResponseType';

export const customTag = {
  $name: '超級棒的標籤',
  $_id: '66536a4619c2e234e1ad5065',
  $createdAt: '2024-05-26T16:58:46.240Z',
  $updatedAt: '2024-05-26T16:58:46.240Z',
};

export const GetTagsSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    $tags: [customTag],
    $page: 1,
    $limit: 10,
    $totalCount: 2,
  },
};

export const CreateTagSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    $tag: customTag,
  },
};
