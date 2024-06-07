import { FilterQuery, Types } from 'mongoose';
import ProductModel, { IProduct } from '../models/product';
import { GetProductDTO } from '../dto/product/getProductDto';
import { updateOptions } from '../utils/constants';
import { IEditContent } from '../types/product.type';
import { IOrderProduct } from '../models/order';
import { GetProductDetailDTO } from '../dto/product/getProductDetailDto';

export class ProductRepository {
  public createProducts = async (products: IProduct[]) => {
    return await ProductModel.insertMany(products);
  };

  public findProducts = async ({ filter, options }: GetProductDTO) =>
    await ProductModel.paginate(filter, options);

  public findProductsByFilter = async (filter: FilterQuery<IProduct>) =>
    await ProductModel.find(filter);

  public findProduct = async (filter: FilterQuery<IProduct>) =>
    await ProductModel.findOne(filter);

  public findById = async (productId: Types.ObjectId) =>
    await ProductModel.findOne({ _id: productId });

  public findProductDetail = async ({
    filter,
    projection,
  }: GetProductDetailDTO) => await ProductModel.findOne(filter, projection);

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

  public deleteProduct = async (id: Types.ObjectId) =>
    await ProductModel.findByIdAndDelete(id, updateOptions);

  public updateProduct = async (id: Types.ObjectId, content?: IEditContent) =>
    ProductModel.findByIdAndUpdate(id, content, updateOptions);

  public editProductsSoldAmount = async (products: IOrderProduct[]) => {
    const promises = products.map(
      async ({ productId, amount }) =>
        await ProductModel.findByIdAndUpdate(productId, {
          $inc: { soldAmount: amount },
        }),
    );

    await Promise.all(promises).then((values) => values);
  };
}
