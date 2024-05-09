import { BaseRoute } from './baseRoute';
import IndexController from '../controller/indexController';
import { body } from 'express-validator';
import { CustomResponseType } from '../types/customResponseType';
import { UserVerify } from '../middleware/userVerify';
import passport from 'passport';
import { PassportInit } from '../middleware/passportInit';
export class IndexRoute extends BaseRoute {
  protected controller!: IndexController;

  constructor() {
    super();
    this.initial();
  }

  protected initial(): void {
    this.controller = new IndexController();
    this.setRouters();
  }

  protected setRouters() {
    this.router.post(
      '/v1/user/sign-up',
      /**
       * #swagger.tags = ['Sign-in']
       * #swagger.summary = '註冊'
       */
      /*

      /*	#swagger.parameters['obj'] = {
                  in: 'body',
                  description: 'Sign up information',
                  required: true,
                  schema: { $ref: "#/definitions/SignUpForm" }
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
      /**
       * #swagger.tags = ['Sign-in']
       * #swagger.summary = '登入'
       */
      /*

      /*	#swagger.parameters['obj'] = {
                  in: 'body',
                  description: 'User information.',
                  required: true,
                  schema: { $ref: "#/definitions/LoginForm" }
          } */
      /* #swagger.responses[200] = {
              description: 'OK',
              schema:{
                $ref: "#/definitions/LoginSuccess"
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
      /**
       * #swagger.tags = ['Sign-in']
       * #swagger.summary = '忘記密碼'
       */
      /*

        /*	#swagger.parameters['obj'] = {
                  in: 'body',
                  description: 'Forgot Password User Email.',
                  required: true,
                  schema: { $ref: "#/definitions/ForgotPwdForm" }
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
      /**
       * #swagger.tags = ['Sign-in']
       * #swagger.summary = '重設密碼'
       * #swagger.security=[{"Bearer": []}],
       */
      /*

        /*	#swagger.parameters['obj'] = {
                  in: 'body',
                  description: 'Reset Password.',
                  required: true,
                  schema: { $ref: "#/definitions/ResetPwdForm" }
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

    this.router.get(
      '/v1/user/google-login',
      /**
       * #swagger.tags = ['Sign-in']
       * #swagger.summary = 'Google第三方登入'
       */
      /*

        /*	#swagger.parameters['obj'] = {
                  in: 'body',
                  description: 'Google Login',
                  required: true,
                  schema: { $ref: "#/definitions/ResetPwdForm" }
          } */

      /* #swagger.responses[200] = {
              description: 'OK',
              schema:{
                $ref: "#/definitions/Success"
              }
            }
         */
      PassportInit,
      passport.authenticate('google', {
        scope: ['email', 'profile'],
      }),
    );

    this.router.get(
      '/v1/user/google/callback',
      this.responseHandler(this.controller.googleCallback),
    );

    this.router.post(
      '/v1/user/google-update',
      /**
       * #swagger.tags = ['Sign-in']
       * #swagger.summary = '首次Google第三方登入後進行一般註冊'
       */

      /*	#swagger.parameters['obj'] = {
                  in: 'body',
                  description: 'Sign up after Google Login',
                  required: true,
                  schema: { $ref: "#/definitions/SignUpForm" }
          } */

      /* #swagger.responses[200] = {
              description: 'OK',
              schema:{
                $ref: "#/definitions/Success"
              }
            }
         */
      UserVerify,
      body('account')
        .exists()
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '帳號'),
      body('pwd')
        .exists()
        .isLength({ min: 8 })
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '密碼'),
      body('confirmPwd').exists(),
      this.responseHandler(this.controller.googleSignUp),
    );
  }
}
