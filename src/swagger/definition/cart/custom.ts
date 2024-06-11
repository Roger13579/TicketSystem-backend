import { DeleteCartType, EditCartType } from '../../../types/cart.type';
import { defaultItem } from './general';

const propName = {
  amount:
    '商品數量，type 為 inc 時 amount 需是不為 0 的整數，type 為 set 時 amount 需為不為 0 的正整數。',
  type: '新增商品數量的方式，inc 為相對設值，set 為絕對設值',
  productId: '商品 id',
};

const properties = {
  plan: {
    type: 'object',
    required: ['name', 'headCount', 'discount'],
    properties: {
      name: {
        type: 'string',
        description: '方案名稱',
        example: '雙人同行',
      },
      discount: {
        type: 'number',
        description: '方案折扣 (0.95-0.1)',
        example: 0.8,
      },
      headCount: {
        type: 'number',
        description: '方案人數',
        example: 1,
      },
    },
  },
  productId: {
    type: 'string',
    description: propName.productId,
    example: defaultItem.$_id,
  },
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
    products: {
      descriptions: '要刪除的購物車商品列表',
      type: 'array',
      items: {
        type: 'object',
        required: ['productId', 'plan'],
        properties: {
          productId: properties.productId,
          plan: properties.plan,
        },
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
        required: ['productId', 'amount', 'type', 'plan'],
        properties: {
          productId: properties.productId,
          plan: properties.plan,
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
