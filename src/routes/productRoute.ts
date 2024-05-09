import ProductController from '../controller/productController';
import { IsAdmin } from '../middleware/isAdmin';
import { UserCheck, UserVerify } from '../middleware/userVerify';
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
      /*  #swagger.parameters['title'] = {
            in: 'query',
            required: false,
            description: '模糊搜尋：商品名稱',
            type: 'string',
            schema:{
              $ref:"#/definitions/CustomGetProductTitleQuery"
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
          #swagger.parameters['theaters'] = {
            in: 'query',
            required: false,
            description: '精準搜尋：位置 (多個則以逗號分開)',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomGetProductTheatersQuery"
            }
          }
          #swagger.parameters['isLaunched'] = {
            in: 'query',
            required: false,
            description: '是否販售',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomGetProductIsLaunchedQuery"
            }
          }
          #swagger.parameters['isPublic'] = {
            in: 'query',
            required: false,
            description: '是否公開',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomGetProductIsPublicQuery"
            }
          }
          #swagger.parameters['startAtFrom'] = {
            in: 'query',
            required: false,
            description: '開始活動時間-起',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomGetProductStartAtFromQuery"
            }
          }
          #swagger.parameters['startAtTo'] = {
            in: 'query',
            required: false,
            description: '開始活動時間-迄',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomGetProductStartAtToQuery"
            }
          }
          #swagger.parameters['sellStartAtFrom'] = {
            in: 'query',
            required: false,
            description: '開始販售時間-迄',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomGetProductSellStartFromQuery"
            }
          }
          #swagger.parameters['sellStartAtTo'] = {
            in: 'query',
            required: false,
            description: '開始販售時間-迄',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomGetProductSellStartToQuery"
            }
          }
          #swagger.parameters['recommendWeights'] = {
            in: 'query',
            required: false,
            description: '精準搜尋：推薦權重 (多個則以逗號分開)',
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
            description: '精準搜尋：標籤 (多個則以逗號分開)，先不要用',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomGetProductTagQuery"
            }
          }
          #swagger.parameters['page'] = {
            in: 'query',
            required: true,
            description: '頁數',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomGetProductPageQuery"
            }
          }
          #swagger.parameters['limit'] = {
            in: 'query',
            required: false,
            description: '每頁資料數',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomGetProductLimitQuery"
            }
          }
          #swagger.parameters['sortBy'] = {
            in: 'query',
            required: false,
            description: '排序根據, e.g. startAt, price, sellStartAt, type, vendor, theater, title, _id, soldAmount,createdAt,降冪則在前面加上 - ',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomGetProductSortByQuery"
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
      UserCheck,
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
      this.responseHandler(this.controller.createProducts),
    );
  }
}
