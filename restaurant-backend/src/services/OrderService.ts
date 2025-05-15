import mongoose from 'mongoose';
import OrderValidator from '../validators/orderValidator';
import { Address } from '../models/AddressModel';
import { Order } from '../models/OrderModel';
import { OrderDetail } from '../models/OrderDetailModel';
import Cart from '../models/CartModel';
import { Dish } from '../models/DishModel';

enum DeliveryStatus {
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

  async createOrder(userId: string, finalAddressId: string, payment_method: string, delivery_type: string, items_price: number, total_quantity: number, total_price: number, order_type: string, delivery_time_type: string, scheduled_time: Date, session: any) {
    const newOrder = new Order({
      user_id: userId,
      address_id: finalAddressId,
      payment_method,
      delivery_type,
      items_price: items_price,
      total_quantity: total_quantity,
      total_price: total_price,
      vat_amount: total_price * 0.1,
      shipping_fee: 5000,
      delivery_status: 'PENDING_PICKUP',
      order_type,
      delivery_time_type,
      scheduled_time
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
    const { userId, address_id, address, payment_method, delivery_type, items, order_type, delivery_time_type, scheduled_time } = input;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const finalAddressId = await this.handleAddress(userId, address_id, address, session);

      const { orderItems, totalAmount } = await OrderValidator.validateCartAndItems(userId, items, session);

      const items_price = totalAmount;
      const total_quantity = orderItems.reduce((total, item) => total + item.quantity, 0);
      const shipping_fee = 5000;
      const vat_amount = items_price * 0.1;
      const total_price = items_price + shipping_fee + vat_amount;

      const savedOrder = await this.createOrder(userId, finalAddressId, payment_method, delivery_type, items_price, total_quantity, total_price, order_type, delivery_time_type, scheduled_time, session);

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

  async getUserOrders(userId: mongoose.Types.ObjectId) {
    try {
      const orders = await Order.find({ user_id: userId })
        .populate('address_id')
        .sort({ createdAt: -1 })
        .lean();

      const orderIds = orders.map((order) => order._id);

      const orderDetails = await OrderDetail.find({
        order_id: { $in: orderIds },
      })
        .populate({
          path: 'dish_id',
          populate: {
            path: 'categories', 
            model: 'categories',
            select: 'Cate_name', 
          },
        })
        .lean();
      
      // Gom nhóm orderDetails theo order_id
      const detailsMap = new Map<string, any[]>();
      for (const detail of orderDetails) {
        const key = detail.order_id.toString();
        if (!detailsMap.has(key)) {
          detailsMap.set(key, []);
        }
        detailsMap.get(key)!.push(detail);
      }

      const ordersWithDetails = orders.map((order) => ({
        ...order,
        order_items: detailsMap.get(order._id.toString()) || [],
      }));

      return ordersWithDetails;
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
}

export default new OrderService();
