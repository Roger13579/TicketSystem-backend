import { NewProductDto } from '../dto/newProductDto';
import { ProductFilterDTO } from '../dto/productFilterDto';
import ProductModel, { IProduct } from '../models/product';
import { AccountType } from '../types/user.type';

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
    } = productFilterDto.getFilter;
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
    newProductsDto: NewProductDto,
  ): Promise<IProduct[] | void> {
    return ProductModel.insertMany(newProductsDto.getNewProducts);
  }

  public async findProducts(
    productFilterDto: ProductFilterDTO,
  ): Promise<IProduct[]> {
    const { page, limit, sortBy, accountType } = productFilterDto.getFilter;
    const filter = this.createProductFilter(productFilterDto);
    const selection =
      accountType === AccountType.admin ? '' : '-recommendWeight -isPublic';
    const options = {
      ...(page && limit && { skip: (page - 1) * limit }),
      ...(limit && { limit }),
      sort: sortBy || '-createdAt',
    };
    return ProductModel.find(filter, selection, options);
  }

  public async countProducts(
    productFilterDto: ProductFilterDTO,
  ): Promise<number> {
    const filter = this.createProductFilter(productFilterDto);
    return ProductModel.countDocuments(filter);
  }
}
