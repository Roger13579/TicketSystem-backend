import { CreateGroupDto } from "../dto/group/createGroupDto";
import { GroupModel, IGroup } from "../models/group";
import OrderModel, { IOrder } from "../models/order";

export class OrderRepository {
  public async createOrder(createGroupDto: CreateGroupDto): Promise<IOrder> {
    return OrderModel.create(new OrderModel(createGroupDto));
  }
}