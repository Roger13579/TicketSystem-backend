import BaseRoute from './baseRoute';
import UserController from '../controller/userController';

class UserRoute extends BaseRoute {
  private userController = new UserController();

  constructor() {
    super();
    this.setRouters();
    this.prefix = '/user';
  }

  protected setRouters() {
    this.router.post(
      '/',
      /* 	#swagger.tags = ['Sign-in']
        #swagger.description = 'Endpoint to sign in a specific user' */

      /*	#swagger.parameters['obj'] = {
                in: 'body',
                description: 'User information.',
                required: true,
                schema: { $ref: "#/definitions/Success" }
        } */

      /* #swagger.security = [{
                "apiKeyAuth": []
        }] */
      this.userController.createUser,
    );
  }
}

export default UserRoute;
