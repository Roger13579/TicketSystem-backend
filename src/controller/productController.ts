import { BaseController } from './baseController';
import { CustomResponseType } from '../types/customResponseType';
import { ResponseObject } from '../utils/responseObject';
import { ProductService } from '../service/productService';
import { NewProductVo } from '../vo/newProductVo';
import {
  IDeleteProductsReq,
  IEditProductsReq,
  ICreateProductsReq,
  IGetProductsReq,
} from '../types/product.type';
import { IProduct } from '../models/product';
import { NextFunction, Request, Response } from 'express';
import { EditProductDTO } from '../dto/product/editProductsDto';
import { ProductFilterDTO } from '../dto/product/productFilterDto';
import { GetProductVo } from '../vo/product/getProductVo';

class ProductController extends BaseController {
  private readonly productService = new ProductService();

  public getProducts = async (
    req: IGetProductsReq,
  ): Promise<ResponseObject> => {
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
    req: ICreateProductsReq,
  ): Promise<ResponseObject> => {
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

  public deleteProducts = async (req: IDeleteProductsReq) => {
    const { deletedCount } = await this.productService.deleteProducts(
      req.body.productIds,
    );
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      deletedCount,
    );
  };

  public editProducts = async (req: IEditProductsReq) => {
    const editProductDto = new EditProductDTO(req);
    const products = await this.productService.editProducts(editProductDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      { products },
    );
  };
}

export default ProductController;
