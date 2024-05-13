import { CustomResponseType } from '../../types/customResponseType';

const propName = {
  title: '活動標題',
  theater: '活動地點',
  movieTitle: '電影名稱',
  time: '活動時間',
  amount: '活動人數',
  haveTicket: '是否持有票券',
  content: '活動內容',
};

const customGroup = {
  title: '活動',
  theater: '威秀影城',
  movieTitle: '好看的電影',
  time: '2024-05-10 10:10',
  amount: 5,
  haveTicket: true,
  content: '好活動',
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
  required: ['title', 'location', 'movieTitle', 'time', 'amount', 'haveTicket'],
  properties: {
    title: {
      type: 'string',
      description: propName.title,
      example: customGroup.title,
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
  },
};
