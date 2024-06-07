import { Types } from 'mongoose';
import { EditCartDTO } from '../dto/cart/editCartDto';
import { CartRepository } from '../repository/cartRepository';
import {
  EditCartType,
  EditErrorType,
  ICartPagination,
  TCreateInvalidItemParam,
  THandleExistedItemProp,
} from '../types/cart.type';
import { GetCartDTO } from '../dto/cart/getCartDto';
import { DeleteItemDTO } from '../dto/cart/deleteItemDto';
import { ProductRepository } from '../repository/productRepository';
import { ICart } from '../models/cart';
import { CustomResponseType } from '../types/customResponseType';
import { throwError } from '../utils/errorHandler';

export class CartService {
  private readonly cartRepository: CartRepository = new CartRepository();
  private readonly productRepository: ProductRepository =
    new ProductRepository();

  private readonly createInvalidItem: TCreateInvalidItemParam = (
    item,
    type,
  ) => {
    let subStatus: CustomResponseType = CustomResponseType.OK;
    let subMessage: string = CustomResponseType.OK_MESSAGE;
    switch (type) {
      case EditErrorType.INVALID_PRODUCT:
        subStatus = CustomResponseType.PRODUCT_NOT_FOUND;
        subMessage =
          CustomResponseType.INVALID_EDIT_CART_MESSAGE +
          '商品不允許被加入購物車';
        break;
      case EditErrorType.INVALID_ADD:
        subStatus = CustomResponseType.INVALID_EDIT_CART;
        subMessage = CustomResponseType.INVALID_EDIT_CART_MESSAGE + '新增失敗';
        break;
      case EditErrorType.INVALID_INC_DES:
        subStatus = CustomResponseType.INVALID_EDIT_CART;
        subMessage =
          CustomResponseType.INVALID_EDIT_CART_MESSAGE +
          '商品目前不存在於購物車，無法進行相對減少';
        break;
      case EditErrorType.UNKNOWN:
        subStatus = CustomResponseType.INVALID_EDIT_CART;
        subMessage = CustomResponseType.INVALID_EDIT_CART_MESSAGE + '不明原因';
        break;
      case EditErrorType.INVALID_DELETE:
        subStatus = CustomResponseType.INVALID_DELETE_CART;
        subMessage =
          CustomResponseType.INVALID_DELETE_CART_MESSAGE + '刪除失敗';
        break;
      default:
        break;
    }
    return {
      item,
      subStatus,
      subMessage,
    };
  };

  public readonly getCart = async (getCartDto: GetCartDTO) => {
    const existedCart: ICartPagination =
      await this.cartRepository.getCart(getCartDto);

    if (existedCart) {
      return existedCart;
    }

    return await this.cartRepository.createCart(getCartDto.userId);
  };

  public readonly clearCart = async (userId: Types.ObjectId) => {
    const clearCart = await this.cartRepository.clearCart(userId);
    if (!clearCart) {
      throwError(
        CustomResponseType.INVALID_DELETE_CART_MESSAGE,
        CustomResponseType.INVALID_DELETE_CART,
      );
      return null;
    }
    return clearCart;
  };

  public readonly deleteItem = async ({
    productIds,
    userId,
  }: DeleteItemDTO) => {
    const promises = (productIds || []).map(async (productId) => {
      const deletedItem = await this.cartRepository.deleteItem({
        userId,
        productId,
      });

      return (
        deletedItem ||
        this.createInvalidItem({ productId }, EditErrorType.INVALID_DELETE)
      );
    });

    return await Promise.all(promises).then((values) => values);
  };

  private readonly handleExistedItem = async ({
    existedItem,
    item,
    userId,
  }: THandleExistedItemProp) => {
    const { type, amount, productId } = item;
    const isDeletable =
      type === EditCartType.inc &&
      amount < 0 &&
      existedItem.amount + amount <= 0;

    if (isDeletable) {
      const deletedItem = await this.cartRepository.deleteItem({
        userId,
        productId,
      });

      return (
        deletedItem ||
        this.createInvalidItem(item, EditErrorType.INVALID_DELETE)
      );
    }

    const isEditable =
      (type === EditCartType.inc &&
        (amount > 0 || (amount < 0 && existedItem.amount + amount > 0))) ||
      type === EditCartType.set;

    if (isEditable) {
      const editedItem = await this.cartRepository.editItem({
        userId,
        item,
      });
      return (
        editedItem || this.createInvalidItem(item, EditErrorType.INVALID_ADD)
      );
    }

    return this.createInvalidItem(item, EditErrorType.UNKNOWN);
  };

  public readonly editCart = async (editCartDto: EditCartDTO) => {
    const { products, userId } = editCartDto;

    let cart: ICart;

    // 1-1 確認購物車是否存在
    const existedCart = await this.cartRepository.findCartByUserId(userId);

    // 1-2 購物車不存在就新增
    if (!existedCart) {
      cart = await this.cartRepository.createCart(userId);
    } else {
      cart = existedCart;
    }

    const promises = products.map(async (item) => {
      // 2-1 確認商品是否存在且可被購買
      const { productId, amount } = item;
      const existedProduct = this.productRepository.findProduct({
        _id: item.productId,
        isPublic: true,
      });

      // 2-2 商品不存在

      if (!existedProduct) {
        return this.createInvalidItem(item, EditErrorType.INVALID_PRODUCT);
      }

      // 3. 確認商品是否已在購物車中
      const existedItem = cart.items.find((item) =>
        item.productId?.equals(new Types.ObjectId(productId)),
      );
      // 3-1 已存在
      if (!!existedItem) {
        return await this.handleExistedItem({
          existedItem,
          userId,
          item,
        });
      }

      // 3-2 不存在且新數量為正數
      if (amount > 0) {
        const addedItem = await this.cartRepository.addItem({ item, userId });

        return (
          addedItem || this.createInvalidItem(item, EditErrorType.INVALID_ADD)
        );
      }

      if (amount < 1) {
        return this.createInvalidItem(item, EditErrorType.INVALID_INC_DES);
      }

      return this.createInvalidItem(item, EditErrorType.UNKNOWN);
    });

    return await Promise.all(promises).then((values) => values);
  };
}
