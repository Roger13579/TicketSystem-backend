import { ICart, IItem } from '../../models/cart';
import { IInvalidItem } from '../../types/cart.type';
import moment from 'moment';

export class EditCartVo {
  public readonly items: IItem[];
  public readonly errors: IInvalidItem[];
  constructor(carts: (IInvalidItem | ICart)[]) {
    const invalidItems: IInvalidItem[] = [];
    const uniqItems: Record<string, IItem> = {};

    carts.forEach((cart) => {
      if ('subStatus' in cart) {
        invalidItems.push(cart as IInvalidItem);
      } else {
        const { items } = cart as ICart;
        items.forEach((item) => {
          const index = item.productId.toString();
          const existedItem = uniqItems[index];
          if (existedItem) {
            const isNew = moment(item.updatedAt).isAfter(
              moment(existedItem.updatedAt),
            );
            if (isNew) {
              uniqItems[index] = item;
            }
          } else {
            uniqItems[index] = item;
          }
        });
      }
    });

    this.errors = invalidItems;
    this.items = Object.values(uniqItems);
  }
}
