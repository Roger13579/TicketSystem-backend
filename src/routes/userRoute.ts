import { BaseRoute } from './baseRoute';
import UserController from '../controller/userController';
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
  }
}
