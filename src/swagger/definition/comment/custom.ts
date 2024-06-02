import { Status } from '../../../types/common.type';

export const propName = {
  productId: '商品 id',
  rating: '星等',
  content: '評論內容',
  status: '評論狀態',
  commentId: '評論 id',
};

export const CustomCreateCommentObj = {
  type: 'object',
  required: ['productId', 'rating', 'content', 'status'],
  properties: {
    productId: {
      type: 'string',
      example: 'idididid',
      description: propName.productId,
    },
    rating: {
      type: 'number',
      example: 1,
      description: propName.rating + '(1-5)',
    },
    content: {
      type: 'string',
      example: '宇宙讚讚讚',
      description: propName.content,
    },
    status: {
      type: 'string',
      example: 'active',
      description: propName.status,
      enum: Object.values(Status),
    },
  },
};

export const CustomEditCommentsObj = {
  type: 'object',
  required: ['comments'],
  properties: {
    comments: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'status'],
        properties: {
          id: {
            type: 'string',
            example: '123456a',
            description: propName.commentId,
          },
          status: {
            type: 'string',
            enum: Object.keys(Status),
            example: Status.active,
            description: propName.status,
          },
        },
      },
    },
  },
};

/**
 * @description 自己定義的 definition，適用於包含刪除評論 id 列表 request.body
 */
export const CustomDeleteCommentsObj = {
  type: 'object',
  required: ['commentIds'],
  properties: {
    commentIds: {
      type: 'array',
      items: {
        type: 'string',
        example: 'thisIsAnId',
        description: '要刪除的評論 id',
      },
    },
  },
};

export const CustomGetCommentsRatingsQuery = {
  example: '1,2,3,4,5',
};

export const CustomGetCommentsProductIdsQuery = {
  example: 'asdfasdf,asdfasdfasd',
};

export const CustomGetCommentsContentQuery = {
  example: '讚讚的內容',
};
