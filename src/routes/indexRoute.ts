import { BaseRoute } from './baseRoute';
import IndexController from '../controller/indexController';
import { UserVerify } from '../middleware/userVerify';
class IndexRoute extends BaseRoute {
  protected controller!: IndexController;

  constructor() {
    super();
    this.initial();
  }

  protected initial(): void {
    this.controller = new IndexController();
    super.initial();
  }

  protected setRouters() {
    this.router.get(
      '/123',
      UserVerify,
      this.responseHandler(this.controller.index),
    );
  }
}

export default IndexRoute;
