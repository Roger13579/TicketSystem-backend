import { CustomResponseType } from '../../types/customResponseType';

const propName = {
  title: '活動標題',
  placeholderImg: '活動照片',
  theater: '活動地點',
  movieTitle: '電影名稱',
  time: '活動時間',
  amount: '活動人數',
  haveTicket: '是否持有票券',
  content: '活動內容',
  name: '姓名',
  nickname: '暱稱',
  phone: '電話',
  lineId: 'line ID',
  participant: '建立人資料',
};

const customGroup = {
  title: '活動',
  placeholderImg: '我是照片網址',
  theater: '威秀影城',
  movieTitle: '好看的電影',
  time: '2024-05-10 10:10',
  amount: 5,
  haveTicket: true,
  content: '好活動',
  name: '我的名字',
  nickname: '我的暱稱',
  phone: '我的電話',
  lineId: '我的line ID',
  participant: {
    name: '我是主揪',
    nickname: '主揪',
    phone: '主揪電話',
    lineId: '主揪line ID',
  },
};

export const CreateGroupSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    $groupId: 'aaabbbcc123123',
  },
};

export const CustomCreateGroupObj = {
  type: 'object',
  required: [
    'title',
    'placeholderImg',
    'location',
    'movieTitle',
    'time',
    'amount',
    'haveTicket',
    'participant',
  ],
  properties: {
    title: {
      type: 'string',
      description: propName.title,
      example: customGroup.title,
    },
    placeholderImg: {
      type: 'string',
      description: propName.placeholderImg,
      example: customGroup.placeholderImg,
    },
    theater: {
      type: 'string',
      description: propName.theater,
      example: customGroup.theater,
    },
    movieTitle: {
      type: 'string',
      description: propName.movieTitle,
      example: customGroup.movieTitle,
    },
    time: {
      type: 'Date',
      description: propName.time,
      example: customGroup.time,
    },
    amount: {
      type: 'number',
      description: propName.amount,
      example: customGroup.amount,
    },
    haveTicket: {
      type: 'boolean',
      description: propName.haveTicket,
      example: customGroup.haveTicket,
    },
    content: {
      type: 'string',
      description: propName.content,
      example: customGroup.content,
    },
    participant: {
      type: 'object',
      description: propName.participant,
      example: customGroup.participant,
    },
  },
};

export const CustomUpdateGroupObj = {
  type: 'object',
  required: ['title', 'content'],
  properties: {
    title: {
      type: 'string',
      description: propName.title,
      example: customGroup.title,
    },
    content: {
      type: 'string',
      description: propName.content,
      example: customGroup.content,
    },
  },
};
export const CustomJoinGroupObj = {
  type: 'object',
  required: ['name', 'nickname', 'phone', 'lineId'],
  properties: {
    name: {
      type: 'string',
      description: propName.name,
      example: customGroup.name,
    },
    nickname: {
      type: 'string',
      description: propName.nickname,
      example: customGroup.nickname,
    },
    phone: {
      type: 'string',
      description: propName.phone,
      example: customGroup.phone,
    },
    lineId: {
      type: 'string',
      description: propName.lineId,
      example: customGroup.lineId,
    },
  },
};
