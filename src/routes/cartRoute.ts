import { CartController } from '../controller/cartController';
import { UserVerify } from '../middleware/userVerify';
import { EditCartPipe } from '../validator/cart/editCart.pipe';
import { GetCartPipe } from '../validator/cart/getCart.pipe';
import { BaseRoute } from './baseRoute';

export class CartRoute extends BaseRoute {
  protected controller!: CartController;

  constructor() {
    super();
    this.initial();
  }

  protected initial() {
    this.controller = new CartController();
    this.setRouters();
  }

  protected setRouters() {
    // 取得購物車
    this.router.get(
      '/v1/cart',
      /**
       * #swagger.tags = ['Cart']
       * #swagger.summary = '取得使用者購物車'
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
            $ref:'#/definitions/GetCartSuccess'
          }
        }
       */
      UserVerify,
      this.usePipe(GetCartPipe),
      this.responseHandler(this.controller.getCart),
    );

    // 刪除購物車內商品
    this.router.delete(
      '/v1/cart/:productId',
      /**
       * #swagger.tags = ['Cart']
       * #swagger.summary = '刪除購物車內商品'
       * #swagger.security=[{"Bearer": []}]
       */
      /*
        #swagger.parameters['productId'] ={
          in:'path',
          description:'商品ID',
          required: true,
          type: 'string'
        }
       */
      /**
        #swagger.responses[200]={
          description:'OK',
          schema:{
            $ref:'#/definitions/EditCartSuccess'
          }
        }
       */
      UserVerify,
      this.responseHandler(this.controller.deleteItem),
    );

    // 編輯購物車
    this.router.patch(
      '/v1/cart/:productId',
      /**
       * #swagger.tags = ['Cart']
       * #swagger.summary = '編輯使用者購物車'
       * #swagger.security=[{"Bearer": []}]
       */
      /*
        #swagger.parameters['productId'] ={
          in:'path',
          description:'商品ID',
          required: true,
          type: 'string'
        }
       */
      /*
        #swagger.parameters['obj'] ={
          in:'body',
          description:'欲編輯的商品資料',
          schema:{
            $ref:"#/definitions/CustomEditCartObj"
          }
        } 
       */
      /**
        #swagger.responses[200]={
          description:'OK',
          schema:{
            $ref:'#/definitions/EditCartSuccess'
          }
        }
       */
      UserVerify,
      this.usePipe(EditCartPipe),
      this.responseHandler(this.controller.editCart),
    );
  }
}
