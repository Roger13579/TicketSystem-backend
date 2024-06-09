import { GetTicketsDto } from '../../../dto/ticket/getTicketsDto';

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
