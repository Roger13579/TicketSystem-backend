import { Types } from 'mongoose';
import { IEditContent, IEditProductsReq } from '../../types/product.type';

export class EditProductDTO {
  private readonly _products: {
    id: Types.ObjectId;
    content?: IEditContent;
  }[] = [];

  get products() {
    return this._products;
  }

  get tagNames() {
    return [
      ...new Set(
        this._products.map(({ content }) => content?.tagNames || []).flat(),
      ),
    ];
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
        tagNames,
      }) => {
        const content = {
          ...(tagNames && { tagNames }),
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

        return { id, content };
      },
    );
  }
}
