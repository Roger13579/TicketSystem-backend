import { Types } from 'mongoose';
import { IEditContent, IEditProductsReq } from '../../types/product.type';

export class EditProductDTO {
  private _updatedProducts: {
    id: Types.ObjectId;
    content?: IEditContent;
  }[] = [];

  get updatedProducts() {
    return this._updatedProducts;
  }

  constructor(req: IEditProductsReq) {
    req.body.products.forEach(
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
        const content = {
          ...(title && { title }),
          ...(type && { type }),
          ...(genre && { genre }),
          ...(vendor && { vendor }),
          ...(theater && { theater }),
          ...(price && { price }),
          ...(amount && { amount }),
          ...(plans && { plans }),
          ...(startAt && { startAt }),
          ...(sellEndAt && { sellEndAt }),
          ...(sellStartAt && { sellStartAt }),
          ...(recommendWeight && { recommendWeight }),
          ...(isPublic !== undefined && { isPublic }),
          ...(isLaunched !== undefined && { isLaunched }),
          ...(photoPath && { photoPath }),
          ...(notifications !== undefined && { notifications }),
          ...(highlights !== undefined && { highlights }),
          ...(introduction && { introduction }),
          ...(cautions !== undefined && { cautions }),
          ...(confirmations !== undefined && { confirmations }),
          ...(cancelPolicies !== undefined && { cancelPolicies }),
          ...(certificates !== undefined && { certificates }),
          ...(brief && { brief }),
        };

        if (Object.keys(content).length > 0) {
          this._updatedProducts = [
            ...this._updatedProducts,
            {
              id,
              content,
            },
          ];
        }
      },
    );
  }
}
