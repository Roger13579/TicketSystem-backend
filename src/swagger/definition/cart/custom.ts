import { EditCartType } from '../../../types/cart.type';
import { defaultItem } from './general';

const propName = {
  amount:
    '商品數量，type 為 inc 時 amount 需是不為 0 的整數，type 為 set 時 amount 需為不為 0 的正整數。',
  type: '新增商品數量的方式，inc 為相對設值，set 為絕對設值',
};

export const CustomEditCartObj = {
  type: 'object',
  required: ['amount', 'type'],
  properties: {
    type: {
      type: 'string',
      enum: Object.values(EditCartType),
      description: propName.type,
    },
    amount: {
      type: 'number',
      description: propName.amount,
      example: defaultItem.$amount,
    },
  },
};
