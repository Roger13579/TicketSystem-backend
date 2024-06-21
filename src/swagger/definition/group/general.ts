import { CustomResponseType } from '../../../types/customResponseType';
import { PaginationSuccess } from '../common';

/**
 * @description swagger autogen 可以自動生成，通常用於 response 的 general 資料
 */
export const GroupItem = {
  $_id: 'asdfasdfasd',
  title: '這是一個活動名稱',
  movieTitle: '電影名稱',
  amount: 10,
  placeholderImg: 'imageUrl',
  theater: '信義威秀',
  haveTicket: false,
  time: '2024-05-19',
  vacancy: 2,
  content: '參加參加',
};

export const UserGroupItem = {
  $_id: 'asdfasdfasd',
  title: '這是一個活動名稱',
  movieTitle: '電影名稱',
  amount: 10,
  placeholderImg: 'imageUrl',
  theater: '信義威秀',
  haveTicket: false,
  status: 'ongoing',
  time: '2024-05-19',
  vacancy: 9,
  content: '參加參加',
  participant: [
    {
      userId: '123123aabb',
      phone: '0912345678',
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
    ...PaginationSuccess,
  },
};

export const GetGroupDetailSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    $_id: 'asdfasdfasd',
    title: '這是一個活動名稱',
    movieTitle: '電影名稱',
    amount: 10,
    status: 'ongoing',
    placeholderImg: 'imageUrl',
    theater: '信義威秀',
    haveTicket: false,
    time: '2024-05-19',
    vacancy: 9,
    content: '參加參加',
    participant: [
      {
        userId: '123123aabb',
        phone: '0912345678',
        name: '阿明',
        nickName: '小明',
        lineId: '1234567',
      },
    ],
  },
};

export const GetUserGroupSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    $groups: [UserGroupItem],
    ...PaginationSuccess,
  },
};
