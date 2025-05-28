import mongoose from 'mongoose';
import OrderValidator from '../validators/orderValidator';
import { Address } from '../models/AddressModel';
import { Order, IOrder } from '../models/OrderModel';
import { OrderDetail } from '../models/OrderDetailModel';
import Cart from '../models/CartModel';
import { Dish } from '../models/DishModel';
import SearchService from './SearchService';
import { createVNPayPaymentUrl } from '../services/payments/VnPayService';
import { createMomoPaymentUrl  } from '../services/payments/MomoService';

enum DeliveryStatus {
  ORDER_PLACED = 'ORDER_PLACED',
  ORDER_CONFIRMED = 'ORDER_CONFIRMED',
  PENDING = 'PENDING',
  PENDING_PICKUP = 'PENDING_PICKUP',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  DELIVERY_FAILED = 'DELIVERY_FAILED',
  RETURN_REQUESTED = 'RETURN_REQUESTED',
  CANCEL_RETURN_REQUESTED = 'CANCEL_RETURN_REQUESTED',
  RETURN_APPROVED = 'RETURN_APPROVED',
  RETURN_REJECTED = 'RETURN_REJECTED',
  RETURNED = 'RETURNED',
  CANCEL_REQUESTED = 'CANCEL_REQUESTED', 
  CANCELLED = 'CANCELLED',
}

enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  SHIPPING = 'SHIPPING',
  COMPLETED = 'COMPLETED',
  CANCEL_REQUESTED = 'CANCEL_REQUESTED',
  CANCELLED = 'CANCELLED',
  RETURN_REQUESTED = 'RETURN_REQUESTED',
  RETURNED = 'RETURNED',
}
class OrderService {

  private getStatusText(delivery_status: string): string {
    switch (delivery_status) {
      case 'ORDER_PLACED':
        return 'Đã đặt hàng';
      case 'ORDER_CONFIRMED':
        return 'Xác nhận đơn hàng';
      case 'PENDING_PICKUP':
        return 'Chờ nhận hàng';
      case 'PICKED_UP':
        return 'Đã nhận hàng';
      case 'IN_TRANSIT':
        return 'Đang giao';
      case 'DELIVERED':
        return 'Đã giao';
      case 'DELIVERY_FAILED':
        return 'Giao hàng thất bại';
      case 'RETURN_REQUESTED':
        return 'Yêu cầu trả hàng';
      case 'CANCEL_RETURN_REQUESTED':
        return 'Hủy yêu cầu trả hàng';
      case 'RETURN_APPROVED':
        return 'Xác nhận trả hàng';
      case 'RETURN_REJECTED':
        return 'Trả hàng bị từ chối';
      case 'RETURNED':
        return 'Đã trả hàng';
      case 'CANCEL_REQUESTED':
        return 'Yêu cầu hủy đơn hàng';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return delivery_status;
    }
  }

  async handleAddress(
    userId: string,
    address_id: string | null,
    address: any,
    session: any,
    delivery_type: string,
  ) {
    if (delivery_type === 'PICKUP') {
      return null;
    }

    if (address_id) {
      await OrderValidator.validateAddress(address_id);
      return address_id;
    }
    if (address) {
      const newAddress = new Address({ user_id: userId, ...address });
      const savedAddress = await newAddress.save({ session });
      return (savedAddress._id as string).toString();
    }
  }

  async createOrder(
    userId: string,
    finalAddressId: string | undefined | null,
    payment_method: string,
    delivery_type: string,
    totalAmount: number,
    order_type: string,
    delivery_time_type: string,
    total_quantity: number,
    note: string,
    receiver: string | null,
    receiver_phone: string | null,
    scheduled_time: Date | null,
    session: any,
  ) {
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
      receiver,
      receiver_phone,
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
        { session },
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
            dishId: { $in: orderedDishIds },
          },
        },
      },
      { session },
    );
  }

  async handlePostPaymentLogic(order: IOrder, clientIp: string) {
    const payment_method = order.payment_method;
    let redirectUrl = null;
    let bankingInfo = null;

    switch (payment_method) {
      case 'BANKING':
        bankingInfo = {
          bank_name: 'Vietcombank',
          account_number: '0123456789',
          account_name: 'Công ty ABC',
          qr_code: 'https://example.com/qr.png',
          transfer_note: `ORDER-${order._id}`,
        };
        break;

      case 'MOMO':
        redirectUrl = await createMomoPaymentUrl(order, 'wallet');
        break;
      
      case 'MOMO_ATM':
        redirectUrl = await createMomoPaymentUrl(order, 'atm');
        break;

      case 'VNPAY':
        redirectUrl = createVNPayPaymentUrl(order, clientIp);
        break;

      // case 'CREDIT_CARD':
      //   redirectUrl = await creditCardService.createPaymentUrl(order);
      //   break;
    }

    return {
      type: payment_method,
      redirectUrl,
      bankingInfo,
    };
  }

  async markOrderPaid(orderId: string, amount: number) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error('Order not found');

    if (order.total_price !== amount) {
      throw new Error('Paid amount does not match order total');
    }

    order.payment_status = 'PAID';
    order.paid_at = new Date();
    await order.save();

    return order;
  }

  async markOrderFailed(orderId: string) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error('Order not found');

    order.payment_status = 'FAILED';
    await order.save();

    return order;
  }

  async placeOrder(input: any) {
    const {
      userId,
      address_id,
      address,
      payment_method,
      delivery_type,
      items,
      order_type,
      delivery_time_type,
      scheduled_time,
      note,
      receiver,
      receiver_phone,
    } = input;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const finalAddressId = await this.handleAddress(
        userId,
        address_id,
        address,
        session,
        delivery_type,
      );

      const { orderItems, totalAmount } = await OrderValidator.validateCartAndItems(
        userId,
        items,
        session,
      );

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
        receiver,
        receiver_phone,
        scheduled_time,
        session,
      );

      if (!savedOrder) {
        throw { statusCode: 500, message: 'Order placement failed' };
      }

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

      await this.updateDishCounts(orderItems, session);
      const orderedDishIds = items.map((item: { dish_id: any }) => item.dish_id);
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
    try {
      const { page, limit, sortBy, sortOrder, filters } = options;

      const searchOptions = {
        page,
        limit,
        sortBy,
        sortOrder,
        populate: ['user_id', 'address_id'],
        searchFields: ['address_id.full_name', 'address_id.phone', 'receiver', 'receiver_phone'],
        searchTerm: filters.keyword || '',
        filters: {
          status: filters.status,
          payment_method: filters.payment_method,
          delivery_type: filters.delivery_type,
          order_type: filters.order_type,
        },
        dateRange: {
          field: 'createdAt',
          start: filters.createdAtStart ? new Date(filters.createdAtStart) : undefined,
          end: filters.createdAtEnd ? new Date(filters.createdAtEnd) : undefined,
        },
        numberRange: [
          {
            field: 'total_price',
            min: filters.total_priceMin ? Number(filters.total_priceMin) : undefined,
            max: filters.total_priceMax ? Number(filters.total_priceMax) : undefined,
          },
        ],
      };

      const result = await SearchService.search(Order, searchOptions);

      return {
        orders: result.items,
        total: result.total,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
      };
    } catch (error) {
      console.error('Error in getAllOrders:', error);
      throw error;
    }
  }

  async getUserOrders(
    userId: mongoose.Types.ObjectId,
    deliveryStatuses: string[] | null,
    page: number = 1,
    limit: number = 5,
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
          const categoryNames = (dish?.categories || []).map((cat: any) => cat.Cate_name);

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

      // Validate status
      const validStatuses: string[] = Object.values(DeliveryStatus);
      if (!validStatuses.includes(status)) {
        throw { statusCode: 400, message: 'Invalid delivery status' };
      }

      // Restrict admin updates to admin-relevant statuses
      const adminStatuses = [
        DeliveryStatus.ORDER_CONFIRMED,
        DeliveryStatus.PENDING_PICKUP,
        DeliveryStatus.PICKED_UP,
        DeliveryStatus.IN_TRANSIT,
        DeliveryStatus.DELIVERED,
        DeliveryStatus.DELIVERY_FAILED,
        DeliveryStatus.RETURN_APPROVED,
        DeliveryStatus.RETURN_REJECTED,
        DeliveryStatus.RETURNED,
      ];
      if (!adminStatuses.includes(status as DeliveryStatus)) {
        throw { statusCode: 403, message: 'Status not allowed for admin update' };
      }

      // Define valid status transitions
      const validTransitions: { [key: string]: string[] } = {
        [DeliveryStatus.ORDER_PLACED]: [DeliveryStatus.ORDER_CONFIRMED, DeliveryStatus.CANCELLED],
        [DeliveryStatus.ORDER_CONFIRMED]: [DeliveryStatus.PENDING_PICKUP, DeliveryStatus.CANCELLED],
        [DeliveryStatus.PENDING_PICKUP]: [
          DeliveryStatus.PICKED_UP,
          DeliveryStatus.CANCEL_REQUESTED,
        ],
        [DeliveryStatus.PICKED_UP]: [DeliveryStatus.IN_TRANSIT],
        [DeliveryStatus.IN_TRANSIT]: [DeliveryStatus.DELIVERED, DeliveryStatus.DELIVERY_FAILED],
        [DeliveryStatus.DELIVERED]: [DeliveryStatus.RETURN_REQUESTED], // DELIVERED can only transition to RETURN_REQUESTED
        [DeliveryStatus.DELIVERY_FAILED]: [DeliveryStatus.PENDING_PICKUP, DeliveryStatus.CANCELLED], // Allow retry or cancel
        [DeliveryStatus.RETURN_REQUESTED]: [
          DeliveryStatus.RETURN_APPROVED,
          DeliveryStatus.RETURN_REJECTED,
        ],
        [DeliveryStatus.RETURN_APPROVED]: [DeliveryStatus.RETURNED],
        [DeliveryStatus.RETURN_REJECTED]: [], // No further transitions
        [DeliveryStatus.RETURNED]: [], // No further transitions
        [DeliveryStatus.CANCEL_REQUESTED]: [DeliveryStatus.CANCELLED],
        [DeliveryStatus.CANCELLED]: [], // No further transitions
        [DeliveryStatus.CANCEL_RETURN_REQUESTED]: [DeliveryStatus.CANCELLED],
      };

      if (
        validTransitions[order.delivery_status] &&
        !validTransitions[order.delivery_status].includes(status)
      ) {
        throw {
          statusCode: 400,
          message: `Không thể chuyển từ trạng thái "${this.getStatusText(
            order.delivery_status,
          )}" sang "${this.getStatusText(status)}"`,
        };
      }

      order.delivery_status = status as "ORDER_PLACED" | "ORDER_CONFIRMED" | "PENDING_PICKUP" | "PICKED_UP" | "IN_TRANSIT" | "DELIVERED" | "DELIVERY_FAILED" | "RETURN_REQUESTED" | "CANCEL_RETURN_REQUESTED" | "RETURN_APPROVED" | "RETURN_REJECTED" | "RETURNED" | "CANCEL_REQUESTED" | "CANCELLED";

      // Set delivered_at timestamp for DELIVERED status
      if (status === DeliveryStatus.DELIVERED) {
        order.delivered_at = new Date();
      }

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
        case DeliveryStatus.CANCEL_REQUESTED:
          return OrderStatus.CANCEL_REQUESTED;
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
        case DeliveryStatus.CANCEL_REQUESTED:
          return OrderStatus.CANCEL_REQUESTED;
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

      if (order.status !== 'PENDING' || order.delivery_status !== 'PENDING_PICKUP') {
        throw {
          statusCode: 400,
          message: 'Order can only be cancelled when status and delivery_status are PENDING',
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
          message:
            'Return can only be requested when status is COMPLETED and delivery_status is DELIVERED',
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
      order.status = OrderStatus.RETURN_REQUESTED.toString() as any;
      order.delivery_status = DeliveryStatus.RETURN_REQUESTED.toString() as any;
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
          message:
            'Cancel request chỉ được phép khi status = PREPARING và delivery_status = PENDING_PICKUP',
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
