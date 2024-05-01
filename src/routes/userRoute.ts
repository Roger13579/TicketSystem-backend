import { BaseRoute } from './baseRoute';
import UserController from '../controller/userController';
import { body } from 'express-validator';
import { CustomResponseType } from '../types/customResponseType';

export class UserRoute extends BaseRoute {
  protected controller!: UserController;

  constructor() {
    super();
    this.initial();
  }

  protected initial(): void {
    this.controller = new UserController();
    super.initial();
  }

  protected setRouters(): void {
    this.router.post(
      '/v1/user/sign-up',
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
      body('account')
        .exists()
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '帳號'),
      body('email')
        .exists()
        .isEmail()
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '電子信箱'),
      body('pwd')
        .exists()
        .isLength({ min: 8 })
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '密碼'),
      body('confirmPwd').exists(),
      this.responseHandler(this.controller.createUser),
    );
    this.router.post(
      '/v1/user/login',
      /* 	#swagger.tags = ['Login']
        #swagger.description = 'Endpoint to user login' */

      /*	#swagger.parameters['obj'] = {
                in: 'body',
                description: 'User information.',
                required: true,
                schema: { $ref: "#/definitions/Success" }
        } */

      /* #swagger.security = [{
                "apiKeyAuth": []
        }] */
      body('account')
        .exists()
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '帳號'),
      body('pwd')
        .exists()
        .isLength({ min: 8 })
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '密碼'),
      this.responseHandler(this.controller.login),
    );
  }
}
