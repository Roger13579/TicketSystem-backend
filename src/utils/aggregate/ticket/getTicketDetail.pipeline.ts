import { GetTicketDetailDto } from '../../../dto/ticket/getTicketDetailDto';

export const createGetTicketDetailPipeline = ({
  filter,
  projection,
}: GetTicketDetailDto) => {
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
      },
    },
    { $unwind: '$product' },
    {
      $lookup: {
        localField: 'orderId',
        from: 'orders',
        foreignField: '_id',
        as: 'order',
      },
    },
    { $unwind: '$order' },
    { $project: projection },
  ];
};
