/**
 * @description Product 基本顯示資料
 */
export const defaultProjection = {
  _id: 1,
  title: 1,
  genre: 1,
  type: 1,
  brief: 1,
  theater: 1,
  photoPath: 1,
  isLaunched: 1,
};

/**
 * @description Product 詳細顯示資料
 */
export const detailProjection = {
  price: 1,
  amount: 1,
  plans: 1,
  startAt: 1,
  endAt: 1,
  sellEndAt: 1,
  sellStartAt: 1,
  isLaunched: 1,
  notifications: 1,
  highlights: 1,
  introduction: 1,
  cautions: 1,
  confirmations: 1,
  cancelPolicies: 1,
  certificates: 1,
  soldAmount: 1,
  tags: 1,
};
