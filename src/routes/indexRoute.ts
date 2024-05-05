import { BaseRoute } from './baseRoute';
import IndexController from '../controller/indexController';
import { body } from 'express-validator';
import { CustomResponseType } from '../types/customResponseType';
import {UserVerify} from "../middleware/userVerify";
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
      this.responseHandler(this.controller.signUp),
    );
    this.router.post(
      '/v1/user/login',
      /* 	#swagger.tags = ['User']
          #swagger.description = 'Endpoint to user login' */

      /*	#swagger.parameters['obj'] = {
                  in: 'body',
                  description: 'User information.',
                  required: true,
                  schema: { $ref: "#/definitions/loginForm" }
          } */
      /* #swagger.responses[200] = {
              description: 'OK',
              schema:{
                $ref: "#/definitions/loginSuccess"
              }
            }
         */
      body('account')
        .exists()
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '帳號'),
      body('pwd')
        .exists()
        .isLength({ min: 8 })
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '密碼'),
      this.responseHandler(this.controller.login),
    );

    this.router.post(
      '/v1/user/forgot-pwd',
      /* 	#swagger.tags = ['User']

        /*	#swagger.parameters['obj'] = {
                  in: 'body',
                  description: 'Forgot Password User Email.',
                  required: true,
                  schema: { $ref: "#/definitions/forgotPwdForm" }
          } */

      /* #swagger.responses[200] = {
              description: 'OK',
              schema:{
                $ref: "#/definitions/Success"
              }
            }
         */
      body('email')
        .exists()
        .isEmail()
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '電子信箱'),
      this.responseHandler(this.controller.forgotPwd),
    );

    this.router.post(
      '/v1/user/reset-pwd',
      /* 	#swagger.tags = ['User']

        /*	#swagger.parameters['obj'] = {
                  in: 'body',
                  description: 'Reset Password.',
                  required: true,
                  schema: { $ref: "#/definitions/forgotPwdForm" }
          } */

      /* #swagger.responses[200] = {
              description: 'OK',
              schema:{
                $ref: "#/definitions/Success"
              }
            }
         */
        UserVerify,
        body('oldPwd')
            .isLength({ min: 8 })
            .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '密碼'),
        body('pwd')
            .exists()
            .isLength({ min: 8 })
            .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '密碼'),
        body('confirmPwd').exists(),
      this.responseHandler(this.controller.resetPwd),
    );
  }
}

export default IndexRoute;
