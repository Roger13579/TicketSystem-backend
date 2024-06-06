import { GetUserFavoriteDTO } from '../../../dto/user/getUserFavoriteDto';
import { Status } from '../../../types/common.type';

const productFields = (isPublic: boolean) => ({
  product: {
    _id: { $ifNull: ['$product._id', '$favorites.productId'] },
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
  createdAt: '$favorites.createdAt',
  updatedAt: '$favorites.updatedAt',
});

const itemPipeline = ({ page, limit }: { page: number; limit: number }) => [
  { $match: { 'favorites.0': { $exists: true } } },
  { $unwind: { path: '$favorites', preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      localField: 'favorites.productId',
      from: 'products',
      foreignField: '_id',
      as: 'product',
    },
  },
  { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
  {
    $group: {
      _id: '$_id',
      favorites: {
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
    },
  },
  { $addFields: { totalCount: { $size: '$favorites' } } },
  {
    $project: {
      _id: 1,
      totalCount: 1,
      favorites: { $slice: ['$favorites', (page - 1) * limit, limit] },
    },
  },
];

const emptyPipeline = [
  { $match: { 'favorites.0': { $exists: false } } },
  {
    $project: {
      totalCount: { $literal: 0 },
      favorites: [],
    },
  },
];

export const createGetFavoritePipeline = ({
  userId,
  limit,
  page,
}: GetUserFavoriteDTO) => [
  { $match: { _id: userId } },
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
          else: { $arrayElemAt: [`$${Status.disabled}`, 0] },
        },
      },
    },
  },
  { $replaceRoot: { newRoot: '$result' } },
];
