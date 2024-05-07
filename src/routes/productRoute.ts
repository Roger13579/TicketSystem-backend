import ProductController from '../controller/productController';
import { IsAdmin } from '../middleware/isAdmin';
import { UserVerify } from '../middleware/userVerify';
import { BaseRoute } from './baseRoute';

export class ProductRoute extends BaseRoute {
  protected controller!: ProductController;

  constructor() {
    super();
    this.initial();
  }

  protected initial(): void {
    this.controller = new ProductController();
    super.initial();
  }

  protected setRouters(): void {
    this.router.get(
      '/v1/product',
      /**
       * #swagger.tags = ['Product']
       * #swagger.summary = '取得商品列表'
       */
      this.responseHandler(this.controller.getProducts),
    );

    this.router.post(
      '/v1/product',
      /**
       * #swagger.tags = ['Product']
       * #swagger.summary = '新增商品'
       * #swagger.security=[{"Bearer": []}],
       */
      /*
          #swagger.parameters['obj] ={
            in:'body',
            description:'欲新增之商品列表',
            schema:{
              $ref:"#/definitions/CustomCreateProductsObj"
            }
       } 
       */
      /*
          #swagger.responses[200] = {
            description:'OK',
            schema:{
              $ref: "#/definitions/CustomCreateProductsSuccess"
            }
          }
      */
      /*  #swagger.responses[6213] = {
            description:'新增失敗',
            schema:{
              $ref: "#/definitions/CreateProductsError"
            }
          }
       */
      UserVerify,
      IsAdmin,
      this.responseHandler(this.controller.createProducts),
    );
  }
}
