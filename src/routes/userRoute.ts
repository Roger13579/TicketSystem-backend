import { BaseRoute } from './baseRoute';
import UserController from '../controller/userController';
import { body } from 'express-validator';
import { CustomResponseType } from '../types/customResponseType';
import { UserVerify } from '../middleware/userVerify';

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
    this.router.get(
      '/v1/user',
      /**
       * #swagger.tags = ['User']
       * #swagger.summary = '取得使用者資料'
       */
      /**
         #swagger.security=[{"Bearer": []}],
         #swagger.responses[200] = {
          description: 'OK',
          schema: {
            $ref: '#/definitions/userDetail' }
         }
        */
      UserVerify,
      this.responseHandler(this.controller.getUserDetail),
    );
    this.router.patch(
      '/v1/user',
      /**
       * #swagger.tags = ['User']
       * #swagger.summary = '更新使用者資料'
       */
      /*
         #swagger.security=[{"Bearer": []}],
          #swagger.parameters['obj'] = {
            in: 'body',
            description: '可更新部分欄位',
            schema: {
              "name": "roger",
              "birthDate": null,
              "email": "roger@gmail.com",
              "gender": "none",
              "phone": "0912345678",
              "address": "aaaabbb",
              "imgUrl": ""
            }
          }
          */
      /*
          #swagger.responses[200] = {
            description: 'OK',
            schema:{
              $ref: "#/definitions/Success"
            }
          }
        */
      UserVerify,
      this.responseHandler(this.controller.updateUserDetail),
    );
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
      this.responseHandler(this.controller.createUser),
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
