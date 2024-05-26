import { NextFunction } from 'express';
import log4js from '../config/log4js';

import { IProduct } from '../models/product';
import { ProductRepository } from '../repository/productRepository';
import { CustomResponseType } from '../types/customResponseType';
import { AccountType } from '../types/user.type';
import { checkDateOrder } from '../utils/common';
import { AppError, createErrorMsg, throwError } from '../utils/errorHandler';
import { HttpStatus } from '../types/responseType';

import { CommentRepository } from '../repository/commentRepository';
import { EditProductDTO } from '../dto/product/editProductsDto';
import { ProductFilterDTO } from '../dto/product/productFilterDto';

const logger = log4js.getLogger(`ProductRepository`);

export class ProductService {
  private readonly productRepository: ProductRepository =
    new ProductRepository();

  private readonly commentRepository: CommentRepository =
    new CommentRepository();

  private readonly defaultProjection = {
    _id: 1,
    title: 1,
    genre: 1,
    type: 1,
    brief: 1,
    theater: 1,
    photoPath: 1,
  };

  public async createProducts(
    products: IProduct[],
  ): Promise<IProduct[] | void> {
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
          'priceMax 不得小於 priceMin',
        CustomResponseType.INVALID_PRODUCT_FILTER,
      );
    }

    // 使用者與管理者權限確認
    if (accountType !== AccountType.admin) {
      // limit Check: 使用者只能一次取 100 則資料，管理者可以不限量或超過 100 筆
      if (!limit || limit > 100) {
        throwError(
          CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE +
            '使用者只能一次取 100 則資料',
          CustomResponseType.INVALID_PRODUCT_FILTER,
        );
      }
      // isLaunched Check: 使用者只能查公開的商品，不可以查非公開的商品
      if (!isPublic) {
        throwError(
          CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE +
            '使用者只能查公開的商品',
          CustomResponseType.INVALID_PRODUCT_FILTER,
        );
      }
      // recommendWeight Check: 使用者不能搜權重
      if (recommendWeights) {
        throwError(
          CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE +
            '使用者不能搜權重',
          CustomResponseType.INVALID_PRODUCT_FILTER,
        );
      }
    }

    const projection =
      accountType === AccountType.admin
        ? {
            ...this.defaultProjection,
            isPublic: 1,
            isLaunched: 1,
            sellStartAt: 1,
            sellEndAt: 1,
            startAt: 1,
            endAt: 1,
            vendor: 1,
            tags: 1,
            price: 1,
            soldAmount: 1,
            amount: 1,
            // photoPath: 0, // admin 在後台商品列表不需要照片
          }
        : { ...this.defaultProjection, recommendWeight: 0, isPublic: 0 };

    const products = await this.productRepository.findProducts(
      productFilterDto,
      projection,
    );

    const totalCount =
      await this.productRepository.countProducts(productFilterDto);

    return {
      products,
      totalCount,
    };
  }

  public getProductDetail = async (id: string, next: NextFunction) => {
    // TODO: 根據是否為 admin 決定顯示欄位
    const filter = {
      _id: id,
      isPublic: true, // TODO: admin 可以不用這項
    };
    const product = await this.productRepository.findProductDetail(filter, {
      ...this.defaultProjection,
      recommendWeight: 0,
      isPublic: 0,
      // brief: 0, // member 在前台商品詳細資料頁不需要簡短介紹
      price: 1,
      amount: 1,
      plans: 1,
      startAt: 1,
      endAt: 1,
      sellEndAt: 1,
      sellStartAt: 1,
      isLaunched: 1,
      tags: 1,
      notifications: 1,
      highlights: 1,
      introduction: 1,
      cautions: 1,
      confirmations: 1,
      cancelPolicies: 1,
      certificates: 1,
      soldAmount: 1,
    });

    if (!product) {
      return next(
        new AppError(
          CustomResponseType.PRODUCT_NOT_FOUND,
          HttpStatus.BAD_REQUEST,
          CustomResponseType.PRODUCT_NOT_FOUND_MESSAGE,
        ),
      );
    }

    return product;
  };

  public deleteProducts = async (ids: string[]) => {
    const { deletedCount } = await this.productRepository.deleteProducts(ids);

    if (deletedCount > 0) {
      // 真的有商品刪掉了，就要去把相應的 comment 刪掉
      await this.commentRepository.deleteComments(ids);
    }

    return { deletedCount };
  };

  public editProducts = async (editProductDto: EditProductDTO) => {
    return this.productRepository.findByIdAndUploadProducts(editProductDto);
  };
}
