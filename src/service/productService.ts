import log4js from '../config/log4js';
import { ProductFilterDTO } from '../dto/productFilterDto';
import { IProduct } from '../models/product';
import { ProductRepository } from '../repository/productRepository';
import { CustomResponseType } from '../types/customResponseType';
import { AccountType } from '../types/user.type';
import { checkDateOrder } from '../utils/common';
import { createErrorMsg, throwError } from '../utils/errorHandler';

const logger = log4js.getLogger(`ProductRepository`);

export class ProductService {
  private readonly productRepository: ProductRepository =
    new ProductRepository();

  public async createProducts(
    products: IProduct[],
  ): Promise<IProduct[] | void> {
    // 沒有輸入任何新商品
    if (products.length < 1) {
      throwError(
        CustomResponseType.INSERT_ERROR_MESSAGE,
        CustomResponseType.INSERT_ERROR,
      );
    }
    return this.productRepository.createProducts(products).catch((err) => {
      const errMsg = createErrorMsg(err);
      logger.error('create new products error', err);
      throwError(
        CustomResponseType.INSERT_ERROR_MESSAGE + (errMsg ? `:${errMsg}` : ''),
        CustomResponseType.INSERT_ERROR,
      );
    });
  }

  public async findProducts(productFilterDto: ProductFilterDTO): Promise<
    | {
        products: IProduct[];
        totalCount: number;
      }
    | undefined
  > {
    const {
      priceMax,
      priceMin,
      accountType,
      limit,
      isPublic,
      recommendWeights,
      sellStartAtFrom,
      sellStartAtTo,
      startAtFrom,
      startAtTo,
    } = productFilterDto;

    // 確認時間順序
    checkDateOrder(
      { prop: 'sellStartAtFrom', value: sellStartAtFrom },
      { prop: 'sellStartAtTo', value: sellStartAtTo },
      { prop: 'startAtFrom', value: startAtFrom },
      { prop: 'startAtTo', value: startAtTo },
    );

    // price Check: priceMax 要大於 priceMin
    if (priceMax && priceMin && priceMax < priceMin) {
      throwError(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE +
          ': priceMax 不得小於 priceMin',
        CustomResponseType.INVALID_PRODUCT_FILTER,
      );
    }

    // 使用者與管理者權限確認
    if (accountType !== AccountType.admin) {
      // limit Check: 使用者只能一次取 100 則資料，管理者可以不限量或超過 100 筆
      if (!limit || limit > 100) {
        throwError(
          CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE +
            ': 使用者只能一次取 100 則資料',
          CustomResponseType.INVALID_PRODUCT_FILTER,
        );
      }
      // isLaunched Check: 使用者只能查公開的商品，不可以查非公開的商品
      if (!isPublic) {
        throwError(
          CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE +
            ': 使用者只能查公開的商品',
          CustomResponseType.INVALID_PRODUCT_FILTER,
        );
      }
      // recommendWeight Check: 使用者不能搜權重
      if (recommendWeights) {
        throwError(
          CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE +
            ': 使用者不能搜權重',
          CustomResponseType.INVALID_PRODUCT_FILTER,
        );
      }
    }

    const products =
      await this.productRepository.findProducts(productFilterDto);

    const totalCount =
      await this.productRepository.countProducts(productFilterDto);

    return {
      products,
      totalCount,
    };
  }
}
