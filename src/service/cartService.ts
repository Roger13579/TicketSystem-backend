import { Types } from 'mongoose';
import { EditCartDTO } from '../dto/cart/editCartDto';
import { CartRepository } from '../repository/cartRepository';
import { throwError } from '../utils/errorHandler';
import { CustomResponseType } from '../types/customResponseType';
import {
  EditCartType,
  ICartPagination,
  THandleExistedItemProp,
} from '../types/cart.type';
import { GetCartDTO } from '../dto/cart/getCartDto';
import { DeleteItemDTO } from '../dto/cart/deleteItemDto';

export class CartService {
  private readonly cartRepository: CartRepository = new CartRepository();

  public readonly getCart = async (getCartDto: GetCartDTO) => {
    const existedCart: ICartPagination[] =
      await this.cartRepository.getCart(getCartDto);

    if (existedCart) {
      return existedCart[0];
    }

    const newCart = await this.cartRepository.createCart(getCartDto.userId);

    return newCart;
  };

  public readonly deleteItem = async (deleteItemDto: DeleteItemDTO) => {
    const item = await this.cartRepository.deleteItem(deleteItemDto);

    if (!item) {
      throwError(
        CustomResponseType.INVALID_EDIT_CART_MESSAGE +
          '刪除失敗，購物車內無該項商品',
        CustomResponseType.INVALID_EDIT_CART,
      );
    }
    return item;
  };

  private readonly handleExistedItem = async ({
    existedItem,
    editCartDto,
  }: THandleExistedItemProp) => {
    const { type, amount } = editCartDto;
    const isDeletable =
      type === EditCartType.inc &&
      amount < 0 &&
      existedItem.amount + amount <= 0;

    if (isDeletable) {
      return await this.cartRepository.deleteItem(editCartDto);
    }

    const isEditable =
      (type === EditCartType.inc &&
        (amount > 0 || (amount < 0 && existedItem.amount + amount > 0))) ||
      (type === EditCartType.set && amount !== existedItem.amount);

    if (isEditable) {
      return await this.cartRepository.editCart(editCartDto);
    }

    throwError(
      CustomResponseType.INVALID_EDIT_CART,
      CustomResponseType.INVALID_EDIT_CART_MESSAGE +
        '該購物車商品數量相同，不須編輯',
    );
  };

  public readonly editCart = async (editCartDto: EditCartDTO) => {
    const { productId, amount, userId } = editCartDto;
    let existedCart = await this.cartRepository.findCartByUserId(userId);

    if (!existedCart) {
      existedCart = await this.cartRepository.createCart(userId);
    }

    const existedItem = existedCart.items.find((item) =>
      item.productId?.equals(new Types.ObjectId(productId)),
    );

    if (!!existedItem) {
      return await this.handleExistedItem({ existedItem, editCartDto });
    }

    if (amount > 0) {
      return await this.cartRepository.addItem(editCartDto);
    }

    throwError(
      CustomResponseType.INVALID_EDIT_CART,
      CustomResponseType.INVALID_EDIT_CART_MESSAGE + '編輯數量無效',
    );

    return null;
  };
}
