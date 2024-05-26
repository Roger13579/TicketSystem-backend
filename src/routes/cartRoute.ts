import { CartController } from '../controller/cartController';
import { UserVerify } from '../middleware/userVerify';
import { EditCartProductPipe } from '../validator/cart/editCartProduct.pipe';
import { BaseRoute } from './baseRoute';

export class cartRoute extends BaseRoute {
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
      /**
        #swagger.responses[200]={
          description:'OK',
          schema:{
            $ref:'#/definitions/GetCartSuccess'
          }
        }
       */
      UserVerify,
      this.responseHandler(this.controller.getCart),
    );

    // 編輯購物車
    this.router.patch(
      '/v1/cart',
      /**
       * #swagger.tags = ['Cart']
       * #swagger.summary = '編輯使用者購物車'
       * #swagger.security=[{"Bearer": []}]
       */
      /*
        #swagger.parameters['obj'] ={
          in:'body',
          description:'欲編輯的商品，若要刪除則 amount 為 0',
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
      this.usePipe(EditCartProductPipe),
      this.responseHandler(this.controller.editCartProduct),
    );
  }
}
