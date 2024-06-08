import { FilterQuery, Types } from 'mongoose';
import ProductModel, { IProduct } from '../models/product';
import { GetProductDTO } from '../dto/product/getProductDto';
import { updateOptions } from '../utils/constants';
import { IEditProduct } from '../types/product.type';
import { IOrderProduct } from '../models/order';
import { GetProductDetailDTO } from '../dto/product/getProductDetailDto';

export class ProductRepository {
  public createProducts = async (products: IProduct[]) =>
    await ProductModel.insertMany(products);

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
    return await Promise.all(promises).then((values) => values);
  };

  public findByIdAndUploadProducts = async (products: IEditProduct[]) => {
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

  public updateProduct = async ({ id, content }: IEditProduct) =>
    await ProductModel.findByIdAndUpdate(id, content, updateOptions);

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
