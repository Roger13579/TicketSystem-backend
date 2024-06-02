import { Types } from 'mongoose';
import { IEditContent, IEditProductsReq } from '../../types/product.type';
import { pickBy } from 'lodash';

export class EditProductDTO {
  private readonly _products: {
    id: Types.ObjectId;
    content?: IEditContent;
  }[] = [];

  get products() {
    return this._products;
  }

  constructor(req: IEditProductsReq) {
    const { products } = req.body;

    this._products = products.map(
      ({
        id,
        title,
        type,
        genre,
        vendor,
        theater,
        price,
        amount,
        plans,
        startAt,
        sellEndAt,
        sellStartAt,
        recommendWeight,
        isPublic,
        isLaunched,
        photoPath,
        notifications,
        highlights,
        introduction,
        cautions,
        confirmations,
        cancelPolicies,
        certificates,
        brief,
      }) => {
        const content = pickBy(
          {
            title,
            type,
            genre,
            vendor,
            theater,
            price,
            amount,
            plans,
            startAt,
            sellEndAt,
            sellStartAt,
            recommendWeight,
            isPublic,
            isLaunched,
            photoPath,
            notifications,
            highlights,
            introduction,
            cautions,
            confirmations,
            cancelPolicies,
            certificates,
            brief,
          },
          (value) => value !== undefined && value !== null,
        );

        return { id, content };
      },
    );
  }
}
