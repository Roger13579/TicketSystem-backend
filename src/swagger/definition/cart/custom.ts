const propName = {
  productId: '商品 id',
  amount: '商品數量',
};

const customItem = {
  productId: '6653237c397ee87231916356',
  amount: 200,
};

export const CustomEditCartObj = {
  type: 'object',
  required: ['productId', 'amount'],
  properties: {
    productId: {
      type: 'string',
      description: propName.productId,
      example: customItem.productId,
    },
    amount: {
      type: 'number',
      description: propName.amount,
      example: customItem.amount,
    },
  },
};
