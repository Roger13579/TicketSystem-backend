import { CustomResponseType } from '../../../types/customResponseType';

/**
 * @description swagger autogen 可以自動生成，通常用於 response 的 general 資料
 */
export const GroupItem = {
  $_id: 'asdfasdfasd',
  title: '這是一個活動名稱',
  movieTitle: '電影名稱',
  amount: 10,
  placeholderImg: 'imageUrl',
  location: '信義威秀',
  hasTicket: false,
  time: '2024-05-19',
  vacancy: 2,
  content: '參加參加',
  participant: [
    {
      userId: '123123aabb',
      name: '阿明',
      nickName: '小明',
      lineId: '1234567',
    },
  ],
};

/**
 * @description swagger autogen fit，取得揪團列表的 response
 */
export const GetGroupsSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    $groups: [GroupItem],
    $page: 1,
    $limit: 10,
    $totalCount: 5,
  },
};
