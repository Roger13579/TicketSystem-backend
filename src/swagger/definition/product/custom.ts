import moment from 'moment';
import { ProductType, MovieGenre } from '../../../types/product.type';
import {
  CreateProductsSuccess,
  ProductDetailItem,
  PlanItem,
  ProductItem,
} from './general';

/**
 * @description 統一顯示名稱
 */
export const propName = {
  title: '商品名稱',
  type: '商品類別',
  genre: '電影分類',
  vendor: '供應商',
  theater: '位置',
  price: '單張票價',
  amount: '票券總量',
  soldAmount: '已銷售數量',
  plan: {
    name: '方案名稱',
    discount: '方案折扣數',
    headCount: '方案包含人數',
  },
  introduction: '商品介紹',
  isLaunched: '是否開始販賣',
  isPublic: '是否公開',
  recommendWeight: '推薦權重',
  sellEndAt: '販賣結束時間',
  sellStartAt: '販賣開始時間',
  endAt: '活動結束時間',
  startAt: '活動開始時間',
  tags: '標籤列表',
  tag: '標籤',
  photoPath: '商品圖片 Url',
  notifications: '通知列表',
  highlights: '活動亮點列表',
  cautions: '注意事項列表',
  confirmations: '確認詳情列表',
  cancelPolicies: '取消政策列表',
  certificates: '憑證類型列表',
  brief: '簡介',
};

/**
 * @description 自己定義的 definition，適用於 product 資料中 detail 的資料
 */
export const CustomProductDetailProperties = {
  introduction: {
    type: 'string',
    example: ProductDetailItem.$introduction,
    description: `${propName.introduction} (html)`,
  },
  notifications: {
    type: 'array',
    description: propName.notifications,
    example: ProductDetailItem.notifications,
    items: {
      type: 'string',
    },
  },
  highlights: {
    type: 'array',
    description: propName.highlights,
    example: ProductDetailItem.highlights,
    items: {
      type: 'string',
    },
  },
  cautions: {
    type: 'array',
    description: propName.cautions,
    example: ProductDetailItem.cautions,
    items: {
      type: 'string',
    },
  },
  confirmations: {
    type: 'array',
    description: propName.confirmations,
    example: ProductDetailItem.confirmations,
    items: {
      type: 'string',
    },
  },
  cancelPolicies: {
    type: 'array',
    description: propName.cancelPolicies,
    example: ProductDetailItem.cancelPolicies,
    items: {
      type: 'string',
    },
  },
  certificates: {
    type: 'array',
    description: propName.certificates,
    example: ProductDetailItem.certificates,
    items: {
      type: 'string',
    },
  },
  tags: {
    type: 'array',
    description: propName.tags,
    items: {
      type: 'object',
      properties: {
        tagId: {
          type: 'string',
          example: 'AAA',
          description: `${propName.tag}，先把這個拿掉`,
        },
      },
    },
  },
  plans: {
    type: 'array',
    description: '銷售方案',
    items: {
      type: 'object',
      required: ['name', 'discount', 'headCount'],
      properties: {
        name: {
          type: 'string',
          description: propName.plan.name,
          example: PlanItem.$name,
          min: 2,
        },
        discount: {
          type: 'number',
          max: 1,
          min: 0.1,
          example: PlanItem.$discount,
          description: propName.plan.discount,
        },
        headCount: {
          type: 'number',
          min: 0,
          example: PlanItem.$headCount,
          description: propName.plan.headCount,
        },
      },
    },
  },
};

/**
 * @description 自己定義的 definition，適用於包含刪除商品 id 列表 request.body
 */
export const CustomDeleteProductsObj = {
  type: 'object',
  required: ['productIds'],
  properties: {
    productIds: {
      type: 'array',
      items: {
        type: 'string',
        example: 'thisIsAnId',
        description: '要刪除的商品 id',
      },
    },
  },
};

/**
 * @description 用於編輯或新增商品，可更動部分
 */
export const CustomProductProperties = {
  title: {
    type: 'string',
    example: ProductItem.$title,
    description: propName.title,
  },
  brief: {
    type: 'string',
    example: ProductItem.$brief,
    description: propName.brief,
  },
  type: {
    type: 'string',
    example: ProductItem.$type,
    enum: Object.values(ProductType),
    description: propName.type,
  },
  genre: {
    type: 'string',
    example: ProductItem.$genre,
    enum: Object.values(MovieGenre),
    description: propName.genre,
  },
  vendor: {
    type: 'string',
    example: ProductItem.vendor,
    description: propName.vendor,
  },
  theater: {
    type: 'string',
    example: ProductItem.$theater,
    description: propName.theater,
  },
  price: {
    type: 'number',
    example: ProductItem.price,
    min: 100,
    description: propName.price,
  },
  amount: {
    type: 'number',
    example: ProductItem.amount,
    min: 0,
    description: `${propName.amount}，不得低於最大人數方案。`,
  },
  isLaunched: {
    type: 'boolean',
    example: ProductItem.isLaunched,
    description: `${propName.isLaunched}，尚未公開的情況下，商品不可以進行販賣，可販賣的商品須同時在販賣時間的區間且 isLaunched 為 true`,
  },
  isPublic: {
    type: 'boolean',
    example: ProductItem.isPublic,
    description: propName.isPublic,
  },
  recommendWeight: {
    type: 'number',
    min: 1,
    max: 10,
    example: CreateProductsSuccess.$data.$products[0].recommendWeight,
    description: propName.recommendWeight,
  },
  sellEndAt: {
    type: 'Date',
    example: ProductItem.sellEndAt,
    min: moment().add(1, 'day').add(1, 'hour'),
    description: `${propName.sellEndAt}，必須晚於販賣開始時間至少一個小時`,
  },
  sellStartAt: {
    type: 'Date',
    example: ProductItem.sellStartAt,
    min: moment().add(1, 'day'),
    description: `${propName.sellStartAt}，必須晚於現在時間至少一天`,
  },
  endAt: {
    type: 'Date',
    example: ProductItem.endAt,
    min: moment().add(1, 'day').add(3, 'hour'),
    description: `${propName.endAt}，必須晚於活動開始時間至少一個小時`,
  },
  startAt: {
    type: 'Date',
    example: ProductItem.startAt,
    min: moment().add(1, 'day').add(2, 'hour'),
    description: `${propName.startAt}，必須晚於販售結束時間至少一個小時`,
  },
  photoPath: {
    type: 'string',
    description: propName.photoPath,
    example: ProductItem.photoPath,
  },
};

export const CustomCreateProductsObj = {
  type: 'object',
  required: ['products'],
  properties: {
    products: {
      type: 'array',
      items: {
        type: 'object',
        required: [
          'title',
          'type',
          'genre',
          'theater',
          'brief',
          'price',
          'amount',
          'recommendWeight',
          'sellEndAt',
          'sellStartAt',
          'endAt',
          'startAt',
          'introduction',
        ],
        properties: {
          soldAmount: {
            type: 'number',
            example: ProductItem.soldAmount,
            min: 0,
            description: propName.soldAmount,
          },
          ...CustomProductProperties,
          ...CustomProductDetailProperties,
        },
      },
    },
  },
};

export const CustomEditProductObj = {
  type: 'object',
  required: ['products'],
  properties: {
    products: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id'],
        properties: {
          id: {
            type: 'string',
            example: 'asdfasdfas',
            description: '商品 id',
          },
          ...CustomProductProperties,
          ...CustomProductDetailProperties,
        },
      },
    },
  },
};

export const CustomGetProductTitleQuery = {
  example: '很棒的特映會',
};

export const CustomGetProductTypesQuery = {
  example: `${ProductType.corporateBooking},${ProductType.openAir}`,
};

export const CustomGetProductGenresQuery = {
  example: `${MovieGenre.action},${MovieGenre.drama}`,
};

export const CustomGetProductVendorsQuery = {
  example: '貓咪影業,小狗影業',
};

export const CustomGetProductTheatersQuery = {
  example: '信義威秀,晶站威秀',
};

export const CustomGetProductRecommendWeightQuery = {
  example: '1,2,3',
};
export const CustomGetProductPriceMaxQuery = {
  example: '110',
};
export const CustomGetProductPriceMinQuery = {
  example: '10',
};
export const CustomGetProductTagQuery = {
  example: '日舞影展,金馬影展',
};
