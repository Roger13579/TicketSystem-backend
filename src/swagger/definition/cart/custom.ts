import { DeleteCartType, EditCartType } from '../../../types/cart.type';
import { defaultItem } from './general';

const propName = {
  amount:
    '商品數量，type 為 inc 時 amount 需是不為 0 的整數，type 為 set 時 amount 需為不為 0 的正整數。',
  type: '新增商品數量的方式，inc 為相對設值，set 為絕對設值',
  productId: '商品 id',
};

export const CustomDeleteCartObj = {
  type: 'object',
  required: ['type'],
  properties: {
    type: {
      description:
        '刪除方式，all 代表全部刪除 (不可以加 productIds)，items 代表根據 productIds 逐項刪除 (必加 productIds)',
      type: 'string',
      example: DeleteCartType.all,
      enum: Object.keys(DeleteCartType),
    },
    productIds: {
      descriptions: '要刪除的商品 id 列表',
      type: 'array',
      items: {
        type: 'string',
        example: 'thisIsAnId',
        description: propName.productId,
      },
    },
  },
};

export const CustomEditCartObj = {
  type: 'object',
  required: ['products'],
  properties: {
    products: {
      type: 'array',
      items: {
        type: 'object',
        required: ['productId', 'amount', 'type'],
        properties: {
          productId: {
            type: 'string',
            description: propName.productId,
            example: '665b00748f529f5f17923acd',
          },
          type: {
            type: 'string',
            enum: Object.values(EditCartType),
            description: propName.type,
            example: EditCartType.inc,
          },
          amount: {
            type: 'number',
            description: propName.amount,
            example: defaultItem.$amount,
          },
        },
      },
    },
  },
};
