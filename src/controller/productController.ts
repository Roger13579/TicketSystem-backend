import { BaseController } from './baseController';
import { CustomResponseType } from '../types/customResponseType';
import { ResponseObject } from '../utils/responseObject';
import { ProductService } from '../service/productService';
import { NewProductVo } from '../vo/newProductVo';
import { TCreateProductsReq, TGetProductsReq } from '../types/product.type';
import { ProductFilterDTO } from '../dto/productFilterDto';
import { GetProductVo } from '../vo/getProductVo';
import { IProduct } from '../models/product';
import { NextFunction, Request, Response } from 'express';

class ProductController extends BaseController {
  private readonly productService = new ProductService();

  public getProducts = async (
    req: TGetProductsReq,
  ): Promise<ResponseObject> => {
    this.paramVerify(req);
    const productFilterDto = new ProductFilterDTO(req);
    const { page, limit } = productFilterDto;
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
    this.paramVerify(req);
    const products = await this.productService.createProducts(
      req.body.products,
    );
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      new NewProductVo(products as IProduct[]),
    );
  };

  public getProductDetail = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    this.paramVerify(req);
    const product = await this.productService.getProductDetail(
      req.params.id,
      next,
    );
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      { product },
    );
  };
}

export default ProductController;
