import { IndexRoute } from './indexRoute';
import { UserRoute } from './userRoute';
import { BaseRoute } from './baseRoute';
import { ProductRoute } from './productRoute';
import { GroupRoute } from './groupRoute';

export const router: Array<BaseRoute> = [
  new IndexRoute(),
  new UserRoute(),
  new ProductRoute(),
  new GroupRoute(),
];
