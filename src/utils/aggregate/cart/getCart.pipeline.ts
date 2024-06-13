import { GetCartDTO } from '../../../dto/cart/getCartDto';
import { Status } from '../../../types/common.type';

const productFields = (isPublic: boolean) => ({
  product: {
    _id: { $ifNull: ['$product._id', '$items.productId'] },
    ...(isPublic && {
      title: '$product.title',
      type: '$product.type',
      genre: '$product.genre',
      price: '$product.price',
      soldAmount: '$product.soldAmount',
      amount: '$product.amount',
      isLaunched: '$product.isLaunched',
      photoPath: '$product.photoPath',
      sellStartAt: '$product.sellStartAt',
      sellEndAt: '$product.sellEndAt',
    }),
  },
  plan: '$items.plan',
  amount: '$items.amount',
  createdAt: '$items.createdAt',
  updatedAt: '$items.updatedAt',
});

const emptyPipeline = [
  { $match: { 'items.0': { $exists: false } } },
  {
    $project: {
      _id: 1,
      userId: 1,
      totalCount: { $literal: 0 },
      items: [],
      createdAt: 1,
      updatedAt: 1,
    },
  },
];

const itemPipeline = ({ page, limit }: { page: number; limit: number }) => [
  { $match: { 'items.0': { $exists: true } } },
  { $unwind: { path: '$items', preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      localField: 'items.productId',
      from: 'products',
      foreignField: '_id',
      as: 'product',
    },
  },
  { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
  {
    $group: {
      _id: '$_id',
      userId: { $first: '$userId' },
      items: {
        $push: {
          $cond: {
            if: {
              $and: [
                { $ne: ['$product', null] },
                { $eq: ['$product.isPublic', true] },
              ],
            },
            then: productFields(true),
            else: productFields(false),
          },
        },
      },
      createdAt: { $first: '$createdAt' },
      updatedAt: { $first: '$updatedAt' },
    },
  },
  { $addFields: { totalCount: { $size: '$items' } } },
  {
    $project: {
      _id: 1,
      userId: 1,
      totalCount: 1,
      items: { $slice: ['$items', (page - 1) * limit, limit] },
      createdAt: 1,
      updatedAt: 1,
    },
  },
];

export const createGetCartPipeline = ({ userId, page, limit }: GetCartDTO) => [
  { $match: { userId } },
  {
    $facet: {
      [Status.active]: itemPipeline({ page, limit }),
      [Status.disabled]: emptyPipeline,
    },
  },
  {
    $project: {
      result: {
        $cond: {
          if: { $gt: [{ $size: `$${Status.active}` }, 0] },
          then: { $arrayElemAt: [`$${Status.active}`, 0] },
          else: {
            $cond: {
              if: { $gt: [{ $size: `$${Status.disabled}` }, 0] },
              then: { $arrayElemAt: [`$${Status.disabled}`, 0] },
              else: { fallbackField: 'noData' },
            },
          },
        },
      },
    },
  },
  {
    $replaceRoot: {
      newRoot: {
        $cond: {
          if: { $ne: ['$result', null] },
          then: '$result',
          else: { fallbackField: 'noData' },
        },
      },
    },
  },
];
