import indexRoute from './indexRoute';
import {UserRoute} from './userRoute';
import {BaseRoute} from './baseRoute';

export const router: Array<BaseRoute> = [new indexRoute(), new UserRoute()];
