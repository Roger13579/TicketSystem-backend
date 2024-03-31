import BaseRoute from './baseRoute';
import UserController from '../controller/UserController';

class UserRoute extends BaseRoute {
  private userController = new UserController();

  constructor() {
    super();
    this.setRouters();
    this.prefix = '/user';
  }

  protected setRouters() {
    this.router.post('/', this.userController.createUser);
  }
}

export default UserRoute;
