import { BaseRoute } from './baseRoute';
import UserController from '../controller/userController';
import { UserVerify } from '../middleware/userVerify';
import { GetUserFavoritePipe } from '../validator/user/getUserFavorite.pipe';

export class UserRoute extends BaseRoute {
  protected controller!: UserController;

  constructor() {
    super();
    this.initial();
  }

  protected initial(): void {
    this.controller = new UserController();
    this.setRouters();
  }

  protected setRouters(): void {
    this.router.get(
      '/v1/user',
      /**
       * #swagger.tags = ['Account']
       * #swagger.summary = '取得使用者資料'
       * #swagger.security=[{"Bearer": []}],
       */
      /**
         #swagger.responses[200] = {
          description: 'OK',
          schema: {
            $ref: '#/definitions/UserDetail'
          }
         }
        */
      UserVerify,
      this.responseHandler(this.controller.getUserDetail),
    );
    this.router.patch(
      '/v1/user',
      /**
       * #swagger.tags = ['Account']
       * #swagger.summary = '更新使用者資料'
       * #swagger.security=[{"Bearer": []}],
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

    this.router.get(
      '/v1/user/favorite',
      /**
       * #swagger.tags = ['User']
       * #swagger.summary = '取得使用者收藏'
       * #swagger.security=[{"Bearer": []}]
       */
      /*
        #swagger.parameters['limit'] = {
          in: 'query',
          required: true,
          description: '每頁資料數',
          type: 'string',
          schema:{
            $ref:"#/definitions/CustomLimitQuery"
          }
        } 
        #swagger.parameters['page'] = {
          in: 'query',
          required: true,
          description: '頁數',
          type: 'string',
          schema:{
            $ref:"#/definitions/CustomPageQuery"
          }
        } 
      */
      /**
        #swagger.responses[200]={
          description:'OK，若購物車內的商品不存在或 !isPublic，則 product 內僅包含 _id',
          schema:{
            $ref:'#/definitions/GetFavoriteSuccess'
          }
        }
       */
      UserVerify,
      this.usePipe(GetUserFavoritePipe),
      this.responseHandler(this.controller.getUserFavorite),
    );

    this.router.post(
      '/v1/user/favorite/:productId',
      /**
       * #swagger.tags = ['User']
       * #swagger.summary = '新增使用者收藏'
       * #swagger.security=[{"Bearer": []}]
       */
      /*
        #swagger.parameters['productId'] ={
          in:'path',
          description:'商品 ID',
          required: true,
          type: 'string'
       }
       */
      /**
        #swagger.responses[200]={
          description:'OK',
          schema:{
            $ref:'#/definitions/EditFavoriteSuccess'
          }
        }
       */
      UserVerify,
      this.responseHandler(this.controller.addFavorite),
    );

    this.router.delete(
      '/v1/user/favorite/:productId',
      /**
       * #swagger.tags = ['User']
       * #swagger.summary = '刪除使用者收藏'
       * #swagger.security=[{"Bearer": []}]
       */
      /*
        #swagger.parameters['productId'] ={
          in:'path',
          description:'商品 ID',
          required: true,
          type: 'string'
       }
       */
      /**
        #swagger.responses[200]={
          description:'OK',
          schema:{
            $ref:'#/definitions/EditFavoriteSuccess'
          }
        }
       */
      UserVerify,
      this.responseHandler(this.controller.deleteFavorite),
    );
  }
}
