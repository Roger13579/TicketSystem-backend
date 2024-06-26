import { ProductRepository } from '../repository/productRepository';
import { CustomResponseType } from '../types/customResponseType';
import { areTimesInOrder } from '../utils/common';
import { throwError } from '../utils/errorHandler';
import { CommentRepository } from '../repository/commentRepository';
import { EditProductDTO } from '../dto/product/editProductsDto';
import { GetProductDTO } from '../dto/product/getProductDto';
import { Types } from 'mongoose';
import { CreateProductDTO } from '../dto/product/createProductDto';
import { TagRepository } from '../repository/tagRepository';
import { GetProductDetailDTO } from '../dto/product/getProductDetailDto';
import { SortOrder } from '../types/common.type';
import { IProduct } from '../models/product';
import {
  ProductDocumentWithFavorite,
  TCreateInvalidProductParam,
} from '../types/product.type';
import { ITagId } from '../types/tag.type';

export class ProductService {
  private readonly productRepository: ProductRepository =
    new ProductRepository();
  private readonly commentRepository: CommentRepository =
    new CommentRepository();
  private readonly tagRepository: TagRepository = new TagRepository();

  private readonly createInvalidProduct: TCreateInvalidProductParam = (
    product,
  ) => ({
    product,
    subStatus: CustomResponseType.PRODUCT_NOT_FOUND,
    subMessage: CustomResponseType.PRODUCT_NOT_FOUND_MESSAGE,
  });

  public createProducts = async ({ products, tagNames }: CreateProductDTO) => {
    // 直接用 csv 新增的方式
    if (!!tagNames) {
      // 1. 把目前商品要新增卻其實不存在的標籤，先 create tag
      const tagPromises = tagNames.map(
        async (name) => await this.tagRepository.createTag(name),
      );
      const tags = await Promise.all(tagPromises).then((values) => values);
      // 2. 連結新增的商品與他們的標籤
      const productList = products.map((product) => {
        const tagList: ITagId[] = [];

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
    const { sellStartAtFrom, sellStartAtTo, startAtFrom, startAtTo, user } =
      getProductDto;

    // 確認時間順序

    areTimesInOrder(
      [
        { name: 'sellStartAtFrom', value: sellStartAtFrom },
        { name: 'sellStartAtTo', value: sellStartAtTo },
        { name: 'startAtFrom', value: startAtFrom },
        { name: 'startAtTo', value: startAtTo },
      ],
      SortOrder.asc,
    );
    const result = await this.productRepository.findProducts(getProductDto);

    let favoriteProductIds: string[];
    if (user && user.favorites) {
      favoriteProductIds = user.favorites.map((favorite) =>
        favorite.productId.toString(),
      );
    }
    result.docs = result.docs.map((doc) => {
      let isFavorite = false;
      if (user) {
        if (favoriteProductIds.includes(doc._id.toString())) {
          isFavorite = true;
        }
      }
      return {
        ...doc.toObject(),
        isFavorite: isFavorite,
      } as ProductDocumentWithFavorite;
    });
    return result;
  };

  public getProductDetail = async (
    getProductDetailDto: GetProductDetailDTO,
  ) => {
    const product = (await this.productRepository.findProductDetail(
      getProductDetailDto,
    )) as ProductDocumentWithFavorite;

    if (!product) {
      throwError(
        CustomResponseType.PRODUCT_NOT_FOUND_MESSAGE,
        CustomResponseType.PRODUCT_NOT_FOUND,
      );
    }
    let favoriteProductIds: string[] = [];
    if (getProductDetailDto.user && getProductDetailDto.user.favorites) {
      favoriteProductIds = getProductDetailDto.user.favorites.map((favorite) =>
        favorite.productId.toString(),
      );
    }

    return {
      ...product.toObject(),
      isFavorite: favoriteProductIds.includes(product._id.toString()),
    };
  };

  public deleteProducts = async (ids: Types.ObjectId[]) => {
    const promises = ids.map(async (id) => {
      const deletedProduct = await this.productRepository.deleteProduct(id);
      if (!deletedProduct) {
        return this.createInvalidProduct({ id });
      }
      return deletedProduct;
    });

    const deletedProducts = await Promise.all(promises).then(
      (values) => values,
    );

    const validDeletedProducts = deletedProducts.filter(
      (product) => !!(product as IProduct)._id,
    ) as IProduct[];

    if (validDeletedProducts.length > 0) {
      // 真的有商品刪掉了，就要去把相應的 comment 刪掉
      const ids = validDeletedProducts.map(({ _id }) => _id as string);
      await this.commentRepository.deleteComments({
        productId: { $in: ids },
      });
    }

    return deletedProducts;
  };

  public editProducts = async ({ products }: EditProductDTO) => {
    const promises = products.map(async (product) => {
      const { id, content } = product;
      const updatedProduct = await this.productRepository.updateProduct({
        id,
        content,
      });
      if (!updatedProduct) {
        return this.createInvalidProduct(product);
      }
      return updatedProduct;
    });

    return await Promise.all(promises).then((values) => values);
  };
}
