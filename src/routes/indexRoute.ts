import { BaseRoute } from './baseRoute';
import IndexController from '../controller/indexController';
import { body } from 'express-validator';
import { CustomResponseType } from '../types/customResponseType';
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
    this.router.post(
        '/v1/user/sign-up',
        /* 	#swagger.tags = ['User']
          #swagger.description = 'Endpoint to sign up' */

        /*	#swagger.parameters['obj'] = {
                  in: 'body',
                  description: 'Sign up information',
                  required: true,
                  schema: { $ref: "#/definitions/signUpForm" }
          } */

        /* #swagger.responses[200] = {
              description: 'OK',
              schema:{
                $ref: "#/definitions/Success"
              }
            }
         */
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
        this.responseHandler(this.controller.signIn),
    );
    this.router.post(
        '/v1/user/login',
        /* 	#swagger.tags = ['User']
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

export default IndexRoute;
