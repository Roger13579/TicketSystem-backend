import { BaseRoute } from './baseRoute';
import UserController from '../controller/userController';
import { UserVerify } from '../middleware/userVerify';
import { GetUserFavoritePipe } from '../validator/user/getUserFavorite.pipe';
import { GetUserGroupPipe } from '../validator/group/getUserGroup.pipe';

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
              "avatarPath": "avatarPath"
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
          description:'OK，若收藏內的商品不存在或 !isPublic，則 product 內僅包含 _id',
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

    this.router.post(
      '/v1/user/sell-ticket',
      /**
       * #swagger.tags = ['User']
       * #swagger.summary = '上架分票'
       * #swagger.security=[{"Bearer": []}]
       */
      /*
        #swagger.parameters['orderId'] ={
          in:'path',
          description:'訂單 ID',
          required: true,
          type: 'string'
       }
       */
      /*
        #swagger.parameters['productId'] ={
          in:'path',
          description:'商品 ID',
          required: true,
          type: 'string'
       }
       */
      /*
        #swagger.parameters['amount'] ={
          in:'path',
          description:'上架數量',
          required: true,
          type: 'number'
       }
       */
      /**
        #swagger.responses[200]={
          description:'OK',
          schema:{
            $ref:'#/definitions/Success'
          }
        }
       */
      UserVerify,
      this.responseHandler(this.controller.sellTicket),
    );
    this.router.get(
      '/v1/user/share-tickets',
      /**
       * #swagger.tags = ['User']
       * #swagger.summary = '取得用戶可分票'
       * #swagger.security=[{"Bearer": []}]
       */
      /**
       #swagger.responses[200]={
       description:'OK',
       schema:{
       $ref:'#/definitions/GetTransferTicketSuccess'
       }
       }
       */
      UserVerify,
      this.responseHandler(this.controller.getTransferableTicket),
    );
    this.router.get(
      '/v1/user/groups',
      /**
       * #swagger.tags = ['User']
       * #swagger.summary = '取得用戶我的揪團'
       * #swagger.security=[{"Bearer": []}]
       */
      /*
        #swagger.parameters['groupType'] = {
            in: 'query',
            required: true,
            description: '已建立 or 已參加',
            type: 'string',
            enum: ['own', 'joined'],
            schema:{
              $ref: "#/definitions/CustomGetGroupTypeQuery"
            }
          }
        #swagger.parameters['page'] = {
            in: 'query',
            required: true,
            description: '頁數',
            type: 'number',
            schema:{
              $ref: "#/definitions/CustomPageQuery"
            }
          }
          #swagger.parameters['sortOrder'] = {
            in: 'query',
            required: false,
            description: '排序順序',
            type: 'string',
            enum: ["asc", "desc"],
            schema:{
              $ref: "#/definitions/CustomSortOrderQuery"
            }
          }
      */
      /*
       #swagger.responses[200]={
       description:'OK',
       schema:{
          $ref:'#/definitions/GetUserGroupSuccess'
          }
       }
       */
      UserVerify,
      this.usePipe(GetUserGroupPipe),
      this.responseHandler(this.controller.getUserGroups),
    );
  }
}
