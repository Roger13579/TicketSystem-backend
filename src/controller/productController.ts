import { BaseController } from './baseController';
import { CustomResponseType } from '../types/customResponseType';
import { ProductService } from '../service/productService';
import {
  IDeleteProductsReq,
  IEditProductsReq,
  ICreateProductsReq,
  IGetProductsReq,
} from '../types/product.type';
import { EditProductDTO } from '../dto/product/editProductsDto';
import { GetProductDTO } from '../dto/product/getProductDto';
import { GetProductVo } from '../vo/product/getProductVo';
import { CreateProductDTO } from '../dto/product/createProductDto';
import { TMethod } from '../types/common.type';
import { GetProductDetailDTO } from '../dto/product/getProductDetailDto';
import { UpdateProductsVO } from '../vo/product/updateProductsVo';

class ProductController extends BaseController {
  private readonly productService = new ProductService();

  public getProducts: TMethod<IGetProductsReq> = async (req) => {
    const getProductDto = new GetProductDTO(req);
    const info = await this.productService.findProducts(getProductDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      new GetProductVo(info),
    );
  };

  public createProducts: TMethod<ICreateProductsReq> = async (req) => {
    const createProductDto = new CreateProductDTO(req);
    const products = await this.productService.createProducts(createProductDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      { products },
    );
  };

  public getProductDetail: TMethod = async (req) => {
    const getProductDetailDto = new GetProductDetailDTO(req);
    const product =
      await this.productService.getProductDetail(getProductDetailDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      product,
    );
  };

  public deleteProducts: TMethod<IDeleteProductsReq> = async (req) => {
    const infos = await this.productService.deleteProducts(req.body.productIds);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      new UpdateProductsVO(infos),
    );
  };

  public editProducts: TMethod<IEditProductsReq> = async (req) => {
    const editProductDto = new EditProductDTO(req);
    const infos = await this.productService.editProducts(editProductDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      new UpdateProductsVO(infos),
    );
  };
}

export default ProductController;
