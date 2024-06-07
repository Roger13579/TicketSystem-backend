import ProductController from '../controller/productController';
import { IsAdmin } from '../middleware/isAdmin';
import { UserCheck, UserVerify } from '../middleware/userVerify';
import { CreateProductsPipe } from '../validator/product/createProducts.pipe';
import { DeleteProductsPipe } from '../validator/product/deleteProducts.pipe';
import { EditProductsPipe } from '../validator/product/editProducts.pipe';
import { GetProductDetailPipe } from '../validator/product/getProductDetail.pipe';
import { GetProductsPipe } from '../validator/product/getProducts.pipe';
import { BaseRoute } from './baseRoute';

export class ProductRoute extends BaseRoute {
  protected controller!: ProductController;

  constructor() {
    super();
    this.initial();
  }

  protected initial(): void {
    this.controller = new ProductController();
    this.setRouters();
  }

  protected setRouters(): void {
    this.router.get(
      '/v1/product',
      /**
       * #swagger.tags = ['Product']
       * #swagger.summary = '取得商品列表'
       * #swagger.security=[{"Bearer": []}],
       */
      /*  
          #swagger.parameters['limit'] = {
            in: 'query',
            required: true,
            description: '每頁資料數',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomLimitQuery"
            }
          }
          #swagger.parameters['page'] = {
            in: 'query',
            required: true,
            description: '頁數',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomPageQuery"
            }
          }
          #swagger.parameters['isLaunched'] = {
            in: 'query',
            required: false,
            description: '是否販售',
            type: 'string',
            enum:['true','false'],
            schema:{
              $ref: "#/definitions/CustomBooleanQuery"
            }
          }
          #swagger.parameters['isPublic'] = {
            in: 'query',
            required: true,
            description: '是否公開，非管理者只能選擇 true',
            type: 'string',
            enum:['true','false'],
            schema:{
              $ref: "#/definitions/CustomBooleanQuery"
            }
          }
          #swagger.parameters['types'] = {
            in: 'query',
            required: false,
            description: '精準搜尋：商品類別 (多個則以逗號分開)',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomGetProductTypesQuery"
            }
          }
          #swagger.parameters['genres'] = {
            in: 'query',
            required: false,
            description: '精準搜尋：電影分類 (多個則以逗號分開)',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomGetProductGenresQuery"
            }
          }
          #swagger.parameters['vendors'] = {
            in: 'query',
            required: false,
            description: '精準搜尋：供應商 (多個則以逗號分開)',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomGetProductVendorsQuery"
            }
          }
          #swagger.parameters['title'] = {
            in: 'query',
            required: false,
            description: '模糊搜尋：商品名稱',
            type: 'string',
            schema:{
              $ref:"#/definitions/CustomGetProductTitleQuery"
            }
          } 
          #swagger.parameters['theaters'] = {
            in: 'query',
            required: false,
            description: '精準搜尋：位置 (多個則以逗號分開)',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomGetProductTheatersQuery"
            }
          }
          #swagger.parameters['startAtFrom'] = {
            in: 'query',
            required: false,
            description: '開始活動時間-起',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomTimeAtFromQuery"
            }
          }
          #swagger.parameters['startAtTo'] = {
            in: 'query',
            required: false,
            description: '開始活動時間-迄',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomTimeAtToQuery"
            }
          }
          #swagger.parameters['sellStartAtFrom'] = {
            in: 'query',
            required: false,
            description: '開始販售時間-迄',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomTimeAtFromQuery"
            }
          }
          #swagger.parameters['sellStartAtTo'] = {
            in: 'query',
            required: false,
            description: '開始販售時間-迄',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomTimeAtToQuery"
            }
          }
          #swagger.parameters['recommendWeights'] = {
            in: 'query',
            required: false,
            description: '精準搜尋：推薦權重 (多個則以逗號分開) (Admin 專用)',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomGetProductRecommendWeightQuery"
            }
          }
          #swagger.parameters['priceMax'] = {
            in: 'query',
            required: false,
            description: '價格區間-最大值',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomGetProductPriceMaxQuery"
            }
          }
          #swagger.parameters['priceMin'] = {
            in: 'query',
            required: false,
            description: '價格區間-最小值',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomGetProductPriceMinQuery"
            }
          }
          #swagger.parameters['tags'] = {
            in: 'query',
            required: false,
            description: '精準搜尋：標籤 Id',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomGetProductTagQuery"
            }
          }
          #swagger.parameters['sortField'] = {
            in: 'query',
            required: false,
            description: '排序根據',
            type: 'string',
            enum:["startAt", "price", "sellStartAt","startAt", "type", "vendor", "theater", "title", "_id", "soldAmount","createdAt","recommendWeight"],
            schema:{
              $ref: "#/definitions/CustomSortFieldQuery"
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
          #swagger.responses[200] = {
            description:'OK',
            schema:{
              $ref: "#/definitions/GetProductsSuccess"
            }
          }
      */
      UserCheck,
      this.usePipe(GetProductsPipe),
      this.responseHandler(this.controller.getProducts),
    );

    this.router.get(
      '/v1/product/:id',
      /**
       * #swagger.tags = ['Product']
       * #swagger.summary = '取得商品詳細資料'
       * #swagger.security=[{"Bearer": []}],
       */
      /*
        #swagger.parameters['id'] = {
          in: 'path',
          description: '商品 id',
          example: 'abcdefg',
        }
      */
      /*
        #swagger.responses[200] = {
          description: 'OK',
          schema:{
          $ref: '#/definitions/GetProductDetailSuccess'
          }
        }
       */
      UserCheck,
      this.usePipe(GetProductDetailPipe),
      this.responseHandler(this.controller.getProductDetail),
    );

    this.router.post(
      '/v1/product',
      /**
       * #swagger.tags = ['Admin']
       * #swagger.summary = '批次新增商品'
       * #swagger.security=[{"Bearer": []}],
       */
      /*
          #swagger.parameters['obj'] ={
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
              $ref: "#/definitions/CreateProductsSuccess"
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
      this.usePipe(CreateProductsPipe),
      this.responseHandler(this.controller.createProducts),
    );

    this.router.delete(
      '/v1/product',
      /**
       * #swagger.tags = ['Admin']
       * #swagger.summary = '批次刪除商品'
       * #swagger.security=[{"Bearer": []}],
       */
      /*
          #swagger.parameters['obj'] = {
            in: 'body',
            description: '欲刪除的商品 id 列表',
            schema: {
              $ref:"#/definitions/CustomDeleteProductsObj"
            }
          }
       */
      /*
          #swagger.responses[200] = {
            description:'OK',
            schema:{
              $ref: "#/definitions/DeleteProductsSuccess"
            }
          }
       */
      UserVerify,
      IsAdmin,
      this.usePipe(DeleteProductsPipe),
      this.responseHandler(this.controller.deleteProducts),
    );

    this.router.patch(
      '/v1/product',
      /**
       * #swagger.tags = ['Admin']
       * #swagger.summary = '批次編輯商品'
       * #swagger.security=[{"Bearer": []}],
       */
      /*
          #swagger.parameters['obj'] ={
            in:'body',
            description:'欲編輯之商品列表',
            schema:{
              $ref:"#/definitions/CustomEditProductObj"
            }
       } 
       */
      /*
          #swagger.responses[200] = {
            description:'OK',
            schema:{
              $ref: "#/definitions/EditProductsSuccess"
            }
          }
      */
      UserVerify,
      IsAdmin,
      this.usePipe(EditProductsPipe),
      this.responseHandler(this.controller.editProducts),
    );
  }
}
