import { Request } from 'express';
import { IProduct } from '../models/product';

export class NewProductDto {
  private readonly products: [IProduct];

  get getNewProducts(): [IProduct] {
    return this.products;
  }

  constructor(req: Request) {
    this.products = req.body.products;
  }
}
