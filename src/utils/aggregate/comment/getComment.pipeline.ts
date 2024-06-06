import { GetCommentsDTO } from '../../../dto/comment/getCommentsDto';

export const createGetCommentPipeline = ({
  filter,
  sort,
  accounts,
  productNameRegex,
  page,
  limit,
  projection,
}: GetCommentsDTO) => {
  const lookupUser = {
    $lookup: {
      localField: 'userId',
      from: 'users',
      foreignField: '_id',
      as: 'user',
    },
  };

  const lookupProduct = {
    $lookup: {
      localField: 'productId',
      from: 'products',
      foreignField: '_id',
      as: 'product',
    },
  };

  const accountsPipeline = accounts
    ? [
        {
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            'user.account': { $in: accounts },
          },
        },
      ]
    : [];

  const productNamePipeline = productNameRegex
    ? [
        {
          $unwind: {
            path: '$product',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            'product.title': { $regex: productNameRegex, $options: 'i' },
          },
        },
      ]
    : [];

  const basePipeline = [
    {
      $match: {
        ...filter,
      },
    },
  ];

  const facetStage = {
    $facet: {
      metadata: [{ $count: 'totalCount' }],
      comments: [
        { $sort: sort },
        { $skip: (page - 1) * limit },
        {
          $limit: limit,
        },
        { $project: projection },
      ],
    },
  };

  const addFieldsStage = {
    $addFields: {
      metadata: {
        $ifNull: [{ $arrayElemAt: ['$metadata', 0] }, { totalCount: 0 }],
      },
    },
  };

  return [
    ...basePipeline,
    lookupUser,
    ...accountsPipeline,
    lookupProduct,
    ...productNamePipeline,
    facetStage,
    addFieldsStage,
  ];
};
