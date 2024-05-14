import { FilterQuery, ProjectionType } from 'mongoose';
import { ProductFilterDTO } from '../dto/productFilterDto';
import ProductModel, { IProduct } from '../models/product';

export class ProductRepository {
  private createProductFilter(productFilterDto: ProductFilterDTO) {
    const {
      title,
      types,
      genres,
      vendors,
      theaters,
      isLaunched,
      isPublic,
      startAtFrom,
      startAtTo,
      sellStartAtFrom,
      recommendWeights,
      sellStartAtTo,
      priceMax,
      priceMin,
      tags,
    } = productFilterDto;
    const titleRegex = title ? new RegExp(title) : undefined;
    return {
      ...(titleRegex && { title: { $regex: titleRegex } }),
      ...(types && { type: { $in: types } }),
      ...(genres && { genre: { $in: genres } }),
      ...(vendors && { vendor: { $in: vendors } }),
      ...(theaters && { theater: { $in: theaters } }),
      ...(recommendWeights && { recommendWeight: { $in: recommendWeights } }),
      ...(isLaunched !== undefined && { isLaunched }),
      ...(isPublic !== undefined && { isPublic }),
      ...((startAtFrom || startAtTo) && {
        startAt: {
          ...(startAtFrom && { $lte: startAtFrom }),
          ...(startAtTo && { $gte: startAtTo }),
        },
      }),
      ...((sellStartAtFrom || sellStartAtTo) && {
        sellStartAt: {
          ...(sellStartAtFrom && { $lte: sellStartAtFrom }),
          ...(sellStartAtTo && { $gte: sellStartAtTo }),
        },
      }),
      ...((priceMax || priceMin) && {
        price: {
          ...(priceMin && { $lte: priceMin }),
          ...(priceMax && { $gte: priceMax }),
        },
      }),
      ...(tags && { tags: { $in: tags } }),
    };
  }

  public async createProducts(
    products: IProduct[],
  ): Promise<IProduct[] | void> {
    return await ProductModel.insertMany(products);
  }

  public async findProducts(
    productFilterDto: ProductFilterDTO,
    projection: ProjectionType<IProduct>,
  ): Promise<IProduct[]> {
    const { page, limit, sortBy } = productFilterDto;
    const filter = this.createProductFilter(productFilterDto);
    const options = {
      ...(page && limit && { skip: (page - 1) * limit }),
      ...(limit && { limit }),
      sort: sortBy || '-createdAt',
    };
    // TODO: 如果 projection 裡面 tags === 1，則 populate
    return await ProductModel.find(filter, projection, options);
  }

  public findProduct = async (
    filter: FilterQuery<IProduct>,
    projection: ProjectionType<IProduct>,
  ) => {
    return await ProductModel.find(filter, projection).populate({
      path: 'tags',
    });
  };

  public async countProducts(
    productFilterDto: ProductFilterDTO,
  ): Promise<number> {
    const filter = this.createProductFilter(productFilterDto);
    return await ProductModel.countDocuments(filter);
  }
}
