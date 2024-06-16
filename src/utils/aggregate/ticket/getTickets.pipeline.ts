import { GetTicketsDto } from '../../../dto/ticket/getTicketsDto';
import { GetSharedTicketsDto } from '../../../dto/ticket/getSharedTicketsDto';

export const createGetTicketPipeline = ({
  productNameRegex,
  filter,
  options,
  sort,
  limit,
  page,
}: GetTicketsDto) => {
  const productNameFilter = productNameRegex
    ? {
        'product.title': { $regex: productNameRegex },
      }
    : undefined;
  return [
    {
      $match: {
        ...filter,
      },
    },
    {
      $lookup: {
        localField: 'productId',
        from: 'products',
        foreignField: '_id',
        as: 'product',
        pipeline: [
          {
            $project: options.productSelect,
          },
        ],
      },
    },
    { $unwind: '$product' },
    {
      $match: {
        ...(productNameRegex && productNameFilter),
      },
    },
    {
      $facet: {
        metadata: [{ $count: 'totalCount' }],
        tickets: [
          { $sort: sort },
          { $skip: (page - 1) * limit },
          {
            $limit: limit,
          },
          { $project: options.ticketSelect },
        ],
      },
    },
    {
      $set: {
        metadata: [
          {
            $cond: {
              if: { $eq: [{ $size: '$metadata' }, 0] },
              then: [{ totalCount: 0 }],
              else: '$metadata',
            },
          },
        ],
      },
    },
    { $unwind: '$metadata' },
  ];
};

export const createGetSharedTicketPipeline = ({
  options,
  sort,
  limit,
  page,
}: GetSharedTicketsDto) => {
  return [
    {
      $match: {
        isPublished: { $eq: true },
      },
    },
    {
      $lookup: {
        localField: 'productId',
        from: 'products',
        foreignField: '_id',
        as: 'product',
        pipeline: [
          {
            $project: options.productSelect,
          },
        ],
      },
    },
    { $unwind: '$product' },
    // Grouping by orderId and productId
    {
      $group: {
        _id: {
          orderId: '$orderId',
          productId: '$productId',
        },
        tickets: { $push: '$$ROOT' },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        count: 1,
        ticket: { $arrayElemAt: ['$tickets', 0] },
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ['$ticket', { count: '$count' }],
        },
      },
    },
    {
      $facet: {
        metadata: [{ $count: 'totalCount' }],
        tickets: [
          { $sort: sort },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          {
            $project: {
              count: 1,
              ...options.ticketSelect,
            },
          },
        ],
      },
    },
    {
      $set: {
        metadata: [
          {
            $cond: {
              if: { $eq: [{ $size: '$metadata' }, 0] },
              then: [{ totalCount: 0 }],
              else: '$metadata',
            },
          },
        ],
      },
    },
    { $unwind: '$metadata' },
  ];
};
