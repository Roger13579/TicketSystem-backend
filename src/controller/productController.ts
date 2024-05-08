import { BaseController } from './baseController';
import { CustomResponseType } from '../types/customResponseType';
import { ResponseObject } from '../utils/responseObject';
import { ProductService } from '../service/productService';
import { NewProductDto } from '../dto/newProductDto';
import { NewProductVo } from '../vo/newProductVo';
import { TCreateProductsReq, TGetProductsReq } from '../types/product.type';
import { ProductFilterDTO } from '../dto/productFilterDto';
import { GetProductVo } from '../vo/getProductVo';

class ProductController extends BaseController {
  private readonly productService = new ProductService();

  public getProducts = async (
    req: TGetProductsReq,
  ): Promise<ResponseObject> => {
    const productFilterDto = new ProductFilterDTO(req);
    const { page, limit } = productFilterDto.getFilter;
    const info = await this.productService.findProducts(productFilterDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      new GetProductVo(info, page, limit),
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
