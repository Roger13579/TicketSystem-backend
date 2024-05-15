import moment from 'moment';
import { CustomResponseType } from '../../types/customResponseType';
import { ProductType, MovieGenre } from '../../types/product.type';

const propName = {
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

const CustomPlan = {
  name: '三人同行好棒棒',
  discount: 0.5,
  headCount: 10,
};

const CustomProductDetail = {
  plans: [CustomPlan],
  tags: [],
  $introduction: '<p>很棒的商品</p>',
  notifications: ['通知一', '通知二'],
  highlights: ['亮點一', '亮點二'],
  cautions: ['事項一', '事項二'],
  confirmations: ['確認詳情一', '確認詳情二'],
  cancelPolicies: ['取消政策一', '取消政策二'],
  certificates: ['憑證類型一', '憑證類型二'],
};

export const CustomProductDetailProperties = {
  introduction: {
    type: 'string',
    example: CustomProductDetail.$introduction,
    description: `${propName.introduction} (html)`,
  },
  notifications: {
    type: 'array',
    description: propName.notifications,
    example: CustomProductDetail.notifications,
    items: {
      type: 'string',
    },
  },
  highlights: {
    type: 'array',
    description: propName.highlights,
    example: CustomProductDetail.highlights,
    items: {
      type: 'string',
    },
  },
  cautions: {
    type: 'array',
    description: propName.cautions,
    example: CustomProductDetail.cautions,
    items: {
      type: 'string',
    },
  },
  confirmations: {
    type: 'array',
    description: propName.confirmations,
    example: CustomProductDetail.confirmations,
    items: {
      type: 'string',
    },
  },
  cancelPolicies: {
    type: 'array',
    description: propName.cancelPolicies,
    example: CustomProductDetail.cancelPolicies,
    items: {
      type: 'string',
    },
  },
  certificates: {
    type: 'array',
    description: propName.certificates,
    example: CustomProductDetail.certificates,
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
          example: CustomPlan.name,
          min: 2,
        },
        discount: {
          type: 'number',
          max: 1,
          min: 0.1,
          example: CustomPlan.discount,
          description: propName.plan.discount,
        },
        headCount: {
          type: 'number',
          min: 0,
          example: CustomPlan.headCount,
          description: propName.plan.headCount,
        },
      },
    },
  },
};

const CustomProduct = {
  $_id: 'asdfasdfasd',
  $title: '這是一個商品名稱',
  $type: ProductType.premier,
  $genre: MovieGenre.action,
  $theater: '信義威秀',
  $brief: '簡短的介紹介紹',
  vendor: '貓咪影業',
  price: 1100,
  amount: 100,
  soldAmount: 0,
  isLaunched: false,
  isPublic: false,
  recommendWeight: 1,
  sellEndAt: moment().add(2, 'day').add(2, 'hour').toISOString(),
  sellStartAt: moment().add(2, 'days').toISOString(),
  endAt: moment().add(2, 'day').add(6, 'hour').toISOString(),
  startAt: moment().add(2, 'day').add(4, 'hour').toISOString(),
  tags: [{ tagId: '123' }, { tagId: '123' }],
  photoPath: '',
};

export const CreateProductsSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    $products: [{ ...CustomProduct, ...CustomProductDetail }],
  },
};

export const GetProductDetailSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    $product: [
      {
        $_id: 'asdfasdfasd',
        $title: '這是一個商品名稱',
        $type: ProductType.premier,
        $genre: MovieGenre.action,
        $theater: '信義威秀',
        $price: 1100,
        $amount: 100,
        $soldAmount: 0,
        $isLaunched: false,
        $sellEndAt: moment().add(2, 'day').add(2, 'hour').toISOString(),
        $sellStartAt: moment().add(2, 'days').toISOString(),
        $endAt: moment().add(2, 'day').add(6, 'hour').toISOString(),
        $startAt: moment().add(2, 'day').add(4, 'hour').toISOString(),
        $tags: [{ tagId: '123' }, { tagId: '123' }],
        $photoPath: '',
        ...CustomProductDetail,
      },
    ],
  },
};

export const GetProductsSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    $products: [CustomProduct],
    $page: 1,
    $limit: 10,
    $totalCount: 1,
  },
};

export const FindProductSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    $products: [CustomProduct],
  },
};

export const CustomDeleteProductsObj = {
  type: 'object',
  required: ['productIds'],
  properties: {
    productIds: {
      type: 'array',
      items: {
        type: 'string',
        example: 'thisIsAnId',
      },
    },
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
        required: ['_id', 'title', 'type', 'genre', 'theater', 'brief'],
        properties: {
          _id: {
            type: 'string',
            example: 'asdfasdfas',
            description: 'id',
          },
          title: {
            type: 'string',
            example: CustomProduct.$title,
            description: propName.title,
          },
          brief: {
            type: 'string',
            example: CustomProduct.$brief,
            description: propName.brief,
          },
          type: {
            type: 'string',
            example: CustomProduct.$type,
            enum: Object.values(ProductType),
            description: propName.type,
          },
          genre: {
            type: 'string',
            example: CustomProduct.$genre,
            enum: Object.values(MovieGenre),
            description: propName.genre,
          },
          vendor: {
            type: 'string',
            example: CustomProduct.vendor,
            description: propName.vendor,
          },
          theater: {
            type: 'string',
            example: CustomProduct.$theater,
            description: propName.theater,
          },
          price: {
            type: 'number',
            example: CustomProduct.price,
            min: 100,
            description: propName.price,
          },
          amount: {
            type: 'number',
            example: CustomProduct.amount,
            min: 0,
            description: `${propName.amount}，不得低於最大人數方案。`,
          },
          soldAmount: {
            type: 'number',
            example: CustomProduct.soldAmount,
            min: 0,
            description: propName.soldAmount,
          },
          isLaunched: {
            type: 'boolean',
            example: CustomProduct.isLaunched,
            description: `${propName.isLaunched}，尚未公開的情況下，商品不可以進行販賣，可販賣的商品須同時在販賣時間的區間且 isLaunched 為 true`,
          },
          isPublic: {
            type: 'boolean',
            example: CustomProduct.isPublic,
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
            example: CustomProduct.sellEndAt,
            min: moment().add(1, 'day').add(1, 'hour'),
            description: `${propName.sellEndAt}，必須晚於販賣開始時間至少一個小時`,
          },
          sellStartAt: {
            type: 'Date',
            example: CustomProduct.sellStartAt,
            min: moment().add(1, 'day'),
            description: `${propName.sellStartAt}，必須晚於現在時間至少一天`,
          },
          endAt: {
            type: 'Date',
            example: CustomProduct.endAt,
            min: moment().add(1, 'day').add(3, 'hour'),
            description: `${propName.endAt}，必須晚於活動開始時間至少一個小時`,
          },
          startAt: {
            type: 'Date',
            example: CustomProduct.startAt,
            min: moment().add(1, 'day').add(2, 'hour'),
            description: `${propName.startAt}，必須晚於販售結束時間至少一個小時`,
          },
          photoPath: {
            type: 'string',
            description: propName.photoPath,
            example: CustomProduct.photoPath,
          },
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
export const CustomGetProductIsLaunchedQuery = {
  example: 'true',
};
export const CustomGetProductIsPublicQuery = {
  example: 'true',
};
export const CustomGetProductStartAtFromQuery = {
  example: '2024-05-16T03:33:20.000+00:00',
};
export const CustomGetProductStartAtToQuery = {
  example: '2024-05-17T03:33:20.000+00:00',
};
export const CustomGetProductSellStartFromQuery = {
  example: '2024-05-18T03:33:20.000+00:00',
};
export const CustomGetProductSellStartToQuery = {
  example: '2024-05-19T03:33:20.000+00:00',
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
export const CustomGetProductPageQuery = {
  example: '1',
};
export const CustomGetProductLimitQuery = {
  example: '10',
};
export const CustomGetProductSortByQuery = {
  example: '-createdAt',
};
