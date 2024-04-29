import { BaseRoute } from './baseRoute';
import IndexController from '../controller/indexController';
class IndexRoute extends BaseRoute {
  private indexController = new IndexController();

  constructor() {
    super();
    this.setRouters();
  }

  protected setRouters() {
  }
}

export default IndexRoute;
