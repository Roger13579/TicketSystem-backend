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
import { ProductRepository } from '../repository/productRepository';

export class CartService {
  private readonly cartRepository: CartRepository = new CartRepository();
  private readonly productRepository: ProductRepository =
    new ProductRepository();

  public readonly getCart = async (getCartDto: GetCartDTO) => {
    const existedCart: ICartPagination =
      await this.cartRepository.getCart(getCartDto);

    if (existedCart) {
      return existedCart;
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
      CustomResponseType.INVALID_EDIT_CART_MESSAGE +
        '該購物車商品數量相同，不須編輯',
      CustomResponseType.INVALID_EDIT_CART,
    );
  };

  public readonly editCart = async (editCartDto: EditCartDTO) => {
    const { productId, amount, userId } = editCartDto;

    // 1. 確認商品是否存在且可被購買
    const availableProduct = await this.productRepository.findProduct({
      _id: productId,
      isPublic: true,
    });

    if (!availableProduct) {
      throwError(
        CustomResponseType.INVALID_EDIT_CART_MESSAGE + '該商品無法被購買',
        CustomResponseType.INVALID_EDIT_CART,
      );
      return null;
    }

    // 2. 確認購物車是否存在
    let existedCart = await this.cartRepository.findCartByUserId(userId);

    // 2-1 購物車不存在就新增
    if (!existedCart) {
      existedCart = await this.cartRepository.createCart(userId);
    }

    // 3. 確認商品是否已在購物車中
    const existedItem = existedCart.items.find((item) =>
      item.productId?.equals(new Types.ObjectId(productId)),
    );

    // 3-1 已存在
    if (!!existedItem) {
      return await this.handleExistedItem({ existedItem, editCartDto });
    }

    // 3-2 不存在且新數量為正數
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
