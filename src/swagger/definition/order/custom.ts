const propName = {
  userId: '使用者id',
  products: {
    productId: '商品ID',
    title: '商品名稱',
    amount: '數量',
    price: '價錢',
  },
  price: '訂單總價',
  paymentMethod: '付款方式',
  paidAt: '結帳時間',
  deliveryInfo: {
    name: '姓名',
    phone: '電話',
    address: '地址',
    email: '電子信箱',
  },
};

const customItem = {
  userId: 'aaabbbccc',
  products: {
    productId: 'bbbnnmmmm',
    title: '好看的電影',
    amount: '5',
    price: '200',
  },
  price: '商品數量',
  paymentMethod: '商品數量',
  paidAt: '商品數量',
  deliveryInfo: {
    name: 'Roger',
    phone: '0912345678',
    address: 'aaaa',
    email: 'roger@gmail.com',
  },
};

export const CustomCreateOrderObj = {
  type: 'object',
  required: [
    'userId',
    'products',
    'price',
    'paymentMethod',
    'paidAt',
    'deliveryInfo',
  ],
  properties: {
    userId: {
      type: 'string',
      description: propName.userId,
      example: customItem.userId,
    },
    products: {
      type: 'array',
      description: propName.products,
      items: {
        type: 'object',
        properties: {
          productId: {
            type: 'string',
            description: propName.products.productId,
            example: customItem.products.productId,
          },
          title: {
            type: 'string',
            description: propName.products.title,
            example: customItem.products.title,
          },
          amount: {
            type: 'number',
            description: propName.products.amount,
            example: customItem.products.amount,
          },
          price: {
            type: 'number',
            description: propName.products.price,
            example: customItem.products.price,
          },
        },
      },
    },
    price: {
      type: 'number',
      description: propName.price,
      example: customItem.price,
    },
    paymentMethod: {
      type: 'number',
      description: propName.paymentMethod,
      example: customItem.paymentMethod,
    },
    paidAt: {
      type: 'number',
      description: propName.price,
      example: customItem.paidAt,
    },
    deliveryInfo: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: propName.deliveryInfo.name,
          example: customItem.deliveryInfo.name,
        },
        phone: {
          type: 'string',
          example: customItem.deliveryInfo.phone,
          description: propName.deliveryInfo.phone,
        },
        address: {
          type: 'string',
          example: customItem.deliveryInfo.address,
          description: propName.deliveryInfo.address,
        },
        email: {
          type: 'string',
          example: customItem.deliveryInfo.email,
          description: propName.deliveryInfo.email,
        },
      },
    },
  },
};
