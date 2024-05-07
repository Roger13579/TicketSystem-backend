import { Request } from 'express';
import { BaseController } from './baseController';
import { CustomResponseType } from '../types/customResponseType';
import { ResponseObject } from '../utils/responseObject';
import { ProductService } from '../service/productService';
import { NewProductDto } from '../dto/newProductDto';
import { NewProductVo } from '../vo/newProductVo';
import { TCreateProductsReq } from '../types/product.type';

class ProductController extends BaseController {
  private readonly productService = new ProductService();

  public getProducts = async (req: Request): Promise<ResponseObject> => {
    const products = await this.productService.findProducts();
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      products,
    );
  };

  public createProducts = async (
    req: TCreateProductsReq,
  ): Promise<ResponseObject> => {
    const newProductsDto = new NewProductDto(req);
    const products = await this.productService.createProducts(newProductsDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      new NewProductVo(products || []),
    );
  };
}

export default ProductController;
