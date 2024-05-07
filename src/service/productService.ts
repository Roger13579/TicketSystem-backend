import log4js from '../config/log4js';
import { NewProductDto } from '../dto/newProductDto';
import { IProduct } from '../models/product';
import { ProductRepository } from '../repository/productRepository';
import { CustomResponseType } from '../types/customResponseType';
import { createErrorMsg, throwError } from '../utils/errorHandler';

const logger = log4js.getLogger(`ProductRepository`);

export class ProductService {
  private readonly productRepository: ProductRepository =
    new ProductRepository();

  public async createProducts(
    newProductsDto: NewProductDto,
  ): Promise<IProduct[] | void> {
    // 沒有輸入任何新商品
    if (newProductsDto.getNewProducts.length < 1) {
      throwError(
        CustomResponseType.INSERT_ERROR_MESSAGE,
        CustomResponseType.INSERT_ERROR,
      );
    }
    return this.productRepository
      .createProducts(newProductsDto)
      .catch((err) => {
        const errMsg = createErrorMsg(err);
        logger.error('create new products error', err);
        throwError(
          CustomResponseType.INSERT_ERROR_MESSAGE +
            (errMsg ? `:${errMsg}` : ''),
          CustomResponseType.INSERT_ERROR,
        );
      });
  }

  public async findProducts(): Promise<IProduct[] | void> {
    return this.productRepository.findProducts();
  }
}
