import { FilterQuery, ProjectionType, Types } from 'mongoose';
import ProductModel, { IProduct } from '../models/product';
import { ProductFilterDTO } from '../dto/product/productFilterDto';
import { updateOptions } from '../utils/constants';
import { IEditContent } from '../types/product.type';

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

  public createProducts = async (products: IProduct[]) => {
    return await ProductModel.insertMany(products);
  };

  public findProducts = async (
    productFilterDto: ProductFilterDTO,
    projection: ProjectionType<IProduct>,
  ) => {
    const { page, limit, sortBy } = productFilterDto;
    const filter = this.createProductFilter(productFilterDto);
    const options = {
      ...(page && limit && { skip: (page - 1) * limit }),
      ...(limit && { limit }),
      sort: sortBy || '-createdAt',
      projection,
    };
    // TODO: 如果 projection 裡面 tags === 1，則 populate
    return await ProductModel.paginate(filter, options);
  };

  public findProduct = async (filter: FilterQuery<IProduct>) => {
    return await ProductModel.findOne(filter);
  };

  public findById = async (
    productId: Types.ObjectId,
  ): Promise<IProduct | null> => {
    return ProductModel.findOne({ _id: productId });
  };

  public findProductDetail = async (
    filter: FilterQuery<IProduct>,
    projection: ProjectionType<IProduct>,
  ) => {
    return await ProductModel.findOne(filter, projection);
  };

  public deleteProducts = async (ids: Types.ObjectId[]) => {
    const promises = ids.map((id) =>
      ProductModel.findByIdAndDelete(id, updateOptions),
    );
    const deletedProducts = await Promise.all(promises).then(
      (values) => values,
    );
    return deletedProducts;
  };

  public findByIdAndUploadProducts = async (
    products: {
      id: Types.ObjectId;
      content?: IEditContent;
    }[],
  ) => {
    const promises = products.map(({ id, content }) => {
      return ProductModel.findByIdAndUpdate(id, content, updateOptions);
    });

    const newProducts = await Promise.all(promises).then((values) => {
      return values;
    });
    return newProducts;
  };
}
