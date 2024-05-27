import { BaseController } from './baseController';
import { CustomResponseType } from '../types/customResponseType';
import { ResponseObject } from '../utils/responseObject';
import { ProductService } from '../service/productService';
import { NewProductVo } from '../vo/product/newProductVo';
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
import { CreateProductDTO } from '../dto/product/createProductDto';

class ProductController extends BaseController {
  private readonly productService = new ProductService();

  public getProducts = async (
    req: IGetProductsReq,
  ): Promise<ResponseObject> => {
    const productFilterDto = new ProductFilterDTO(req);
    const info = await this.productService.findProducts(productFilterDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      new GetProductVo(info),
    );
  };

  public createProducts = async (
    req: ICreateProductsReq,
  ): Promise<ResponseObject> => {
    const createProductDto = new CreateProductDTO(req);
    const products = await this.productService.createProducts(createProductDto);
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
    const { products } = new NewProductVo([product] as IProduct[]);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      { product: products[0] },
    );
  };

  public deleteProducts = async (req: IDeleteProductsReq) => {
    const products = await this.productService.deleteProducts(
      req.body.productIds,
    );
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      new NewProductVo(products as IProduct[]),
    );
  };

  public editProducts = async (req: IEditProductsReq) => {
    const editProductDto = new EditProductDTO(req);
    const products = await this.productService.editProducts(editProductDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      new NewProductVo(products as IProduct[]),
    );
  };
}

export default ProductController;
