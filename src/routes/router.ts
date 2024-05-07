import indexRoute from './indexRoute';
import { UserRoute } from './userRoute';
import { BaseRoute } from './baseRoute';
import { ProductRoute } from './productRoute';

export const router: Array<BaseRoute> = [
  new indexRoute(),
  new UserRoute(),
  new ProductRoute(),
];
