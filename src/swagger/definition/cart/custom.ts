import { EditCartType } from '../../../types/cart.type';
import { defaultItem, optionalItem } from './general';

const propName = {
  productId: '商品 id',
  amount: '商品數量，type 為 inc 並設 amount < 1則為相對減少',
  type: '新增商品數量的方式，inc 為相對設值，set 為絕對設值',
};

export const CustomEditCartObj = {
  type: 'object',
  required: ['productId', 'amount', 'type'],
  properties: {
    type: {
      type: 'string',
      enum: Object.values(EditCartType),
      description: propName.productId,
    },
    productId: {
      type: 'string',
      description: propName.productId,
      example: optionalItem.$product,
    },
    amount: {
      type: 'number',
      description: propName.amount,
      example: defaultItem.$amount,
    },
  },
};
