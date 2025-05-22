import mongoose from 'mongoose';
import OrderValidator from '../validators/orderValidator';
import { Address } from '../models/AddressModel';
import { Order } from '../models/OrderModel';
import { OrderDetail } from '../models/OrderDetailModel';
import Cart from '../models/CartModel';
import { Dish } from '../models/DishModel';

enum DeliveryStatus {
  PENDING = 'PENDING',
  PENDING_PICKUP = 'PENDING_PICKUP',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  DELIVERY_FAILED = 'DELIVERY_FAILED',
  RETURN_REQUESTED = 'RETURN_REQUESTED',
  RETURNED = 'RETURNED',
  CANCELLED = 'CANCELLED',
}

enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  SHIPPING = 'SHIPPING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
}

class OrderService {

  async handleAddress(userId: string, address_id: string | null, address: any, session: any) {
    if (address_id) {
      await OrderValidator.validateAddress(address_id);
      return address_id;
    }
    if (address) {
      const newAddress = new Address({ user_id: userId, ...address });
      const savedAddress = await newAddress.save({ session });
      return (savedAddress._id as string).toString();
    }
    throw { statusCode: 400, message: 'Address is required' };
  }

  async createOrder(userId: string, finalAddressId: string, payment_method: string, delivery_type: string, totalAmount: number, order_type: string, delivery_time_type: string, total_quantity: number, note: string, scheduled_time: Date | null, session: any) {
    const items_price = totalAmount;
    const vat_amount = items_price * 0.08;
    const shipping_fee = 5000;
    const total_price = items_price + vat_amount + shipping_fee;

    const newOrder = new Order({
      user_id: userId,
      address_id: finalAddressId,
      payment_method,
      delivery_type,
      items_price,
      vat_amount,
      shipping_fee,
      total_price,
      total_quantity,
      delivery_status: 'PENDING',
      order_type,
      delivery_time_type,
      note,
      scheduled_time,
    });

    return await newOrder.save({ session });
  }

  async updateDishCounts(orderItems: any[], session: any) {
    const updateDishPromises = orderItems.map((item) => {
      return Dish.updateOne(
        { _id: item.dish_id },
        {
          $inc: {
            ordered_count: 1,
            totalSoldQuantity: item.quantity,
            countInStock: -1 * item.quantity,
          },
        },
        { session }
      );
    });

    await Promise.all(updateDishPromises);
  }

  async updateCart(userId: string, orderedDishIds: string[], session: any) {
    await Cart.updateOne(
      { userId },
      {
        $pull: {
          items: {
            dishId: { $in: orderedDishIds }
          }
        }
      },
      { session }
    );
  }

  async placeOrder(input: any) {
    const { userId, address_id, address, payment_method, delivery_type, items, order_type, delivery_time_type, scheduled_time, note } = input;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const finalAddressId = await this.handleAddress(userId, address_id, address, session);

      const { orderItems, totalAmount } = await OrderValidator.validateCartAndItems(userId, items, session);

      const total_quantity = orderItems.reduce((sum, item) => sum + item.quantity, 0);

      const savedOrder = await this.createOrder(
        userId,
        finalAddressId,
        payment_method,
        delivery_type,
        totalAmount,
        order_type,
        delivery_time_type,
        total_quantity,
        note,
        scheduled_time,
        session
      );

      if (!savedOrder) {
        throw { statusCode: 500, message: 'Order placement failed' };
      }

      // Save order details
      const orderDetailPromises = orderItems.map((item) => {
        const orderDetail = new OrderDetail({
          order_id: savedOrder._id,
          dish_id: item.dish_id,
          dish_name: item.dish_name,
          unit_price: item.unit_price,
          quantity: item.quantity,
          total_amount: item.total_amount,
          note: item.note,
        });
        return orderDetail.save({ session });
      });

      await Promise.all(orderDetailPromises);

      // Update dish counts
      await this.updateDishCounts(orderItems, session);

      const orderedDishIds = items.map((item: { dish_id: any; }) => item.dish_id);
      await this.updateCart(userId, orderedDishIds, session);

      await session.commitTransaction();
      session.endSession();

      return savedOrder;
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();
      throw {
        statusCode: 500,
        message: error.message || 'Order placement failed',
      };
    }
  }

  async getAllOrders(options: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 1 | -1;
    filters: any;
  }) {
    const { page, limit, sortBy, sortOrder, filters } = options;

    const allowedSortBy = [
      'createdAt',
      'total_price',
      'status',
      'payment_method',
      'delivery_type',
      'order_type',
    ];
    const sortField = allowedSortBy.includes(sortBy) ? sortBy : 'createdAt';

    const allowedFilters = ['status', 'payment_method', 'delivery_type', 'order_type'];
    const query: any = {};

    allowedFilters.forEach((key) => {
      if (filters[key]) {
        query[key] = filters[key];
      }
    });

    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit)
        .populate('user_id address_id'),
      Order.countDocuments(query),
    ]);

    return {
      orders,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserOrders(
    userId: mongoose.Types.ObjectId,
    deliveryStatuses: string[] | null,
    page: number = 1,
    limit: number = 5
  ) {
    try {
      const query: any = { user_id: userId };

      if (deliveryStatuses && deliveryStatuses.length > 0) {
        query.delivery_status = { $in: deliveryStatuses };
      }

      const totalItems = await Order.countDocuments(query);
      const totalPages = Math.ceil(totalItems / limit);

      const orders = await Order.find(query)
        .populate('address_id')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      const orderIds = orders.map((order) => order._id);

      const orderDetails = await OrderDetail.find({
        order_id: { $in: orderIds },
      })
        .populate({
          path: 'dish_id',
          select: 'name images categories',
          populate: {
            path: 'categories',
            model: 'categories',
            select: 'Cate_name',
          },
        })
        .lean();

      const detailsMap = new Map<string, any[]>();
      for (const detail of orderDetails) {
        const key = detail.order_id.toString();
        if (!detailsMap.has(key)) {
          detailsMap.set(key, []);
        }
        detailsMap.get(key)!.push(detail);
      }

      const ordersWithDetails = orders.map((order) => {
        const details = detailsMap.get(order._id.toString()) || [];

        const mappedItems = details.map((detail) => {
          const dish = detail.dish_id;
          const categoryNames = (dish?.categories || []).map(
            (cat: any) => cat.Cate_name
          );

          return {
            ...detail,
            dish_id: dish?._id,
            dish_name: dish?.name,
            dish_images: dish?.images || [],
            categories: categoryNames,
          };
        });

        return {
          ...order,
          order_items: mappedItems,
        };
      });

      return {
        orders: ordersWithDetails,
        totalItems,
        totalPages,
        currentPage: page,
      };
    } catch (error: any) {
      throw {
        statusCode: error.statusCode || 500,
        message: error.message || 'Error retrieving orders',
      };
    }
  }

  async getOrderById(orderId: mongoose.Types.ObjectId) {
    try {
      const order = await Order.findById(orderId).populate('address_id').lean();

      if (!order) {
        throw { statusCode: 404, message: 'Order not found' };
      }
      const orderItems = await OrderDetail.find({ order_id: orderId }).populate('dish_id').lean();

      return {
        ...order,
        order_items: orderItems,
      };
    } catch (error: any) {
      throw {
        statusCode: error.statusCode || 500,
        message: error.message || 'Error retrieving order',
      };
    }
  }

  async updateOrderStatus(orderId: mongoose.Types.ObjectId, status: string) {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw { statusCode: 404, message: 'Order not found' };
      }

      order.delivery_status = status as
        | 'PENDING_PICKUP'
        | 'PICKED_UP'
        | 'IN_TRANSIT'
        | 'DELIVERED'
        | 'DELIVERY_FAILED'
        | 'RETURN_REQUESTED'
        | 'RETURNED'
        | 'CANCELLED';

      const mappedStatus = this.mapDeliveryStatusToOrderStatus(
        order.delivery_status as DeliveryStatus,
        order.order_type,
      );
      order.status = mappedStatus;

      await order.save();

      return order;
    } catch (error: any) {
      throw {
        statusCode: error.statusCode || 500,
        message: error.message || 'Error updating order status',
      };
    }
  }

  mapDeliveryStatusToOrderStatus(
    deliveryStatus: DeliveryStatus,
    orderType: 'DINE_IN' | 'ONLINE',
  ): OrderStatus {
    if (orderType === 'DINE_IN') {
      switch (deliveryStatus) {
        case DeliveryStatus.PENDING_PICKUP:
          return OrderStatus.PREPARING;
        case DeliveryStatus.PICKED_UP:
        case DeliveryStatus.IN_TRANSIT:
          return OrderStatus.SHIPPING;
        case DeliveryStatus.DELIVERED:
          return OrderStatus.COMPLETED;
        case DeliveryStatus.DELIVERY_FAILED:
          return OrderStatus.PENDING;
        case DeliveryStatus.RETURN_REQUESTED:
        case DeliveryStatus.RETURNED:
          return OrderStatus.RETURNED;
        case DeliveryStatus.CANCELLED:
          return OrderStatus.CANCELLED;
        default:
          return OrderStatus.PENDING;
      }
    } else if (orderType === 'ONLINE') {
      switch (deliveryStatus) {
        case DeliveryStatus.PENDING:
          return OrderStatus.PENDING;
        case DeliveryStatus.PENDING_PICKUP:
          return OrderStatus.PREPARING;
        case DeliveryStatus.PICKED_UP:
        case DeliveryStatus.IN_TRANSIT:
          return OrderStatus.SHIPPING;
        case DeliveryStatus.DELIVERED:
          return OrderStatus.COMPLETED;
        case DeliveryStatus.DELIVERY_FAILED:
          return OrderStatus.CANCELLED;
        case DeliveryStatus.RETURN_REQUESTED:
        case DeliveryStatus.RETURNED:
          return OrderStatus.RETURNED;
        case DeliveryStatus.CANCELLED:
          return OrderStatus.CANCELLED;
        default:
          return OrderStatus.PENDING;
      }
    }

    return OrderStatus.PENDING;
  }

  async cancelOrder(orderId: mongoose.Types.ObjectId, reason: string) {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw { statusCode: 404, message: 'Order not found' };
      }

      if (order.status !== 'PENDING' || order.delivery_status !== 'PENDING') {
        throw { 
          statusCode: 400, 
          message: 'Order can only be cancelled when status and delivery_status are PENDING' 
        };
      }

      order.status = 'CANCELLED';
      order.delivery_status = 'CANCELLED';
      order.cancelled_at = new Date();
      order.cancelled_reason = reason;

      await order.save();

      return order;
    } catch (error: any) {
      throw {
        statusCode: error.statusCode || 500,
        message: error.message || 'Error cancelling order',
      };
    }
  }

  async requestReturn(orderId: mongoose.Types.ObjectId, reason: string) {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw { statusCode: 404, message: 'Order not found' };
      }

      if (order.status !== 'COMPLETED' || order.delivery_status !== 'DELIVERED') {
        throw {
          statusCode: 400,
          message: 'Return can only be requested when status is COMPLETED and delivery_status is DELIVERED',
        };
      }

      // Kiểm tra thời gian từ khi giao hàng
      if (!order.delivered_at) {
        throw {
          statusCode: 400,
          message: 'Cannot request return: delivery time not found',
        };
      }

      const deliveryTime = new Date(order.delivered_at);
      const now = new Date();
      const timeDiffInMinutes = (now.getTime() - deliveryTime.getTime()) / (1000 * 60);

      if (timeDiffInMinutes > 30) {
        throw {
          statusCode: 400,
          message: 'Return request must be made within 30 minutes of delivery',
        };
      }

      order.status = 'RETURN_REQUESTED';
      order.delivery_status = 'RETURN_REQUESTED';
      order.returned_at = new Date();
      order.cancelled_reason = reason;

      await order.save();

      return order;
    } catch (error: any) {
      throw {
        statusCode: error.statusCode || 500,
        message: error.message || 'Error requesting return',
      };
    }
  }

  async requestCancel(orderId: mongoose.Types.ObjectId, reason: string) {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw { statusCode: 404, message: 'Order not found' };
      }

      if (order.status !== 'PREPARING' || order.delivery_status !== 'PENDING_PICKUP') {
        throw {
          statusCode: 400,
          message: 'Cancel request chỉ được phép khi status = PREPARING và delivery_status = PENDING_PICKUP',
        };
      }

      order.status = 'CANCEL_REQUESTED';
      order.delivery_status = 'CANCEL_REQUESTED';
      order.cancelled_at = new Date();
      order.cancelled_reason = reason;
      await order.save();
      return order;
    } catch (error: any) {
      throw {
        statusCode: error.statusCode || 500,
        message: error.message || 'Error requesting cancel',
      };
    }
  }
}

export default new OrderService();
