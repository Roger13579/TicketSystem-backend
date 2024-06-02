import { BaseController } from './baseController';
import { CustomResponseType } from '../types/customResponseType';
import { ProductService } from '../service/productService';
import {
  IDeleteProductsReq,
  IEditProductsReq,
  ICreateProductsReq,
  IGetProductsReq,
} from '../types/product.type';
import { NextFunction, Response } from 'express';
import { EditProductDTO } from '../dto/product/editProductsDto';
import { GetProductDTO } from '../dto/product/getProductDto';
import { GetProductVo } from '../vo/product/getProductVo';
import { CreateProductDTO } from '../dto/product/createProductDto';
import { IUserReq } from '../types/common.type';
import { GetProductDetailDTO } from '../dto/product/getProductDetailDto';

class ProductController extends BaseController {
  private readonly productService = new ProductService();

  public getProducts = async (req: IGetProductsReq) => {
    const getProductDto = new GetProductDTO(req);
    const info = await this.productService.findProducts(getProductDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      new GetProductVo(info),
    );
  };

  public createProducts = async (req: ICreateProductsReq) => {
    const createProductDto = new CreateProductDTO(req);
    const products = await this.productService.createProducts(createProductDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      { products },
    );
  };

  public getProductDetail = async (
    req: IUserReq,
    res: Response,
    next: NextFunction,
  ) => {
    const getProductDetailDto = new GetProductDetailDTO(req);
    const product = await this.productService.getProductDetail(
      getProductDetailDto,
      next,
    );
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      { product },
    );
  };

  public deleteProducts = async (req: IDeleteProductsReq) => {
    const products = await this.productService.deleteProducts(
      req.body.productIds,
    );
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      { products },
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
