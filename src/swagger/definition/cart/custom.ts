import { defaultItem, optionalItem } from './general';

const propName = {
  productId: '商品 id',
  amount: '商品數量',
};

export const CustomEditCartObj = {
  type: 'object',
  required: ['productId', 'amount'],
  properties: {
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
