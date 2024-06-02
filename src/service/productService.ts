import { NextFunction } from 'express';
import { ProductRepository } from '../repository/productRepository';
import { CustomResponseType } from '../types/customResponseType';
import { checkDateOrder } from '../utils/common';
import { AppError, throwError } from '../utils/errorHandler';
import { HttpStatus } from '../types/responseType';
import { CommentRepository } from '../repository/commentRepository';
import { EditProductDTO } from '../dto/product/editProductsDto';
import { GetProductDTO } from '../dto/product/getProductDto';
import { Types } from 'mongoose';
import { CreateProductDTO } from '../dto/product/createProductDto';
import { TagRepository } from '../repository/tagRepository';
import { GetProductDetailDTO } from '../dto/product/getProductDetailDto';

export class ProductService {
  private readonly productRepository: ProductRepository =
    new ProductRepository();
  private readonly commentRepository: CommentRepository =
    new CommentRepository();
  private readonly tagRepository: TagRepository = new TagRepository();

  public createProducts = async (createProductDto: CreateProductDTO) => {
    const { products, tagNames } = createProductDto;
    // 直接用 csv 新增的方式
    if (!!tagNames) {
      // 1. 把目前商品要新增卻其實不存在的標籤，先 create tag
      const tagPromises = tagNames.map((name) =>
        this.tagRepository.createTag(name),
      );
      const tags = await Promise.all(tagPromises).then((values) => values);
      // 2. 連結新增的商品與他們的標籤
      const productList = products.map((product) => {
        const tagList: { tagId: Types.ObjectId }[] = [];

        product.tagNames?.forEach((tagName) => {
          const existedTag = tags.find(({ name }) => name === tagName);

          if (existedTag) {
            tagList.push({ tagId: existedTag._id });
          }
        });

        return {
          ...product,
          tagNames: undefined,
          tags: tagList,
        };
      });
      return await this.productRepository.createProducts(productList);
    }
    // 用 tagId 新增商品
    return await this.productRepository.createProducts(products);
  };

  public findProducts = async (getProductDto: GetProductDTO) => {
    const { sellStartAtFrom, sellStartAtTo, startAtFrom, startAtTo } =
      getProductDto;

    // 確認時間順序
    checkDateOrder(
      { prop: 'sellStartAtFrom', value: sellStartAtFrom },
      { prop: 'sellStartAtTo', value: sellStartAtTo },
      { prop: 'startAtFrom', value: startAtFrom },
      { prop: 'startAtTo', value: startAtTo },
    );

    return await this.productRepository.findProducts(getProductDto);
  };

  public getProductDetail = async (
    getProductDetailDto: GetProductDetailDTO,
    next: NextFunction,
  ) => {
    const product =
      await this.productRepository.findProductDetail(getProductDetailDto);

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

  public deleteProducts = async (ids: Types.ObjectId[]) => {
    const products = await this.productRepository.deleteProducts(ids);

    const hasInvalidProduct = products.some((product) => product === null);
    if (hasInvalidProduct) {
      throwError(
        CustomResponseType.PRODUCT_NOT_FOUND_MESSAGE,
        CustomResponseType.PRODUCT_NOT_FOUND,
      );
    }

    if (products.length > 0) {
      // 真的有商品刪掉了，就要去把相應的 comment 刪掉
      await this.commentRepository.deleteComments({ productId: { $in: ids } });
    }

    return products;
  };

  public editProducts = async ({ products }: EditProductDTO) => {
    const editedProducts =
      await this.productRepository.findByIdAndUploadProducts(products);

    const hasInvalidProduct = editedProducts.some(
      (product) => product === null,
    );

    if (hasInvalidProduct) {
      throwError(
        CustomResponseType.PRODUCT_NOT_FOUND_MESSAGE,
        CustomResponseType.PRODUCT_NOT_FOUND,
      );
    }

    return editedProducts;
  };
}
