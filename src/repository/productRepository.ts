import { NewProductDto } from '../dto/newProductDto';
import ProductModel, { IProduct } from '../models/product';

export class ProductRepository {
  public async createProducts(
    newProductsDto: NewProductDto,
  ): Promise<IProduct[] | void> {
    return ProductModel.insertMany(newProductsDto.getNewProducts);
  }

  public async findProducts(): Promise<IProduct[]> {
    return ProductModel.find({});
  }
}
