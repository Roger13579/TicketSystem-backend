import { IndexRoute } from './indexRoute';
import { UserRoute } from './userRoute';
import { BaseRoute } from './baseRoute';
import { ProductRoute } from './productRoute';
import { GroupRoute } from './groupRoute';
import { UploadRoute } from './uploadRoute';
import { CommentRoute } from './commentRoute';
import { cartRoute } from './cartRoute';
import { OrderRoute } from './orderRoute';

export const router: Array<BaseRoute> = [
  new IndexRoute(),
  new UserRoute(),
  new ProductRoute(),
  new GroupRoute(),
  new UploadRoute(),
  new CommentRoute(),
  new OrderRoute(),
  new cartRoute(),
];
