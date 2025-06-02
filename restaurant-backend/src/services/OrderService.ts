import mongoose, { Types } from 'mongoose';
import OrderValidator from '../validators/orderValidator';
import { Address, IAddress } from '../models/AddressModel';
import { Order, IOrder } from '../models/OrderModel';
import { OrderDetail } from '../models/OrderDetailModel';
import Cart from '../models/CartModel';
import { Dish } from '../models/DishModel';
<<<<<<< HEAD
import Payment  from '../models/PaymentModel';
import UserModel, { IUser } from '../models/UserModel';
=======
import Payment from '../models/PaymentModel';
>>>>>>> b306f025d4b475862ea86d487ce1682f3dcb3456
import SearchService from './SearchService';
import { createVNPayPaymentUrl } from '../services/payments/VnPayService';
import { createMomoPaymentUrl } from '../services/payments/MomoService';
import { createPayPalOrder } from '../services/payments/PaypalService';

import axios from 'axios';
import MailerService from './MailerService';

enum Status {
  ORDER_PLACED = 'ORDER_PLACED',
  ORDER_CONFIRMED = 'ORDER_CONFIRMED',
  PENDING_PICKUP = 'PENDING_PICKUP',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  DELIVERY_FAILED = 'DELIVERY_FAILED',
  RETURN_REQUESTED = 'RETURN_REQUESTED',
  RETURN_APPROVED = 'RETURN_APPROVED',
  RETURN_REJECTED = 'RETURN_REJECTED',
  RETURNED = 'RETURNED',
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
  getStripeSession(sessionId: any) {
    throw new Error('Method not implemented.');
  }

  private getStatusText(status: string): string {
    switch (status) {
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
      case 'RETURN_APPROVED':
        return 'Xác nhận trả hàng';
      case 'RETURN_REJECTED':
        return 'Trả hàng bị từ chối';
      case 'RETURNED':
        return 'Đã trả hàng';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
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
    shipping_fee: number,
    receiver: string | null,
    receiver_phone: string | null,
    scheduled_time: Date | null,
    session: any,
  ) {
    const items_price = totalAmount;
    const vat_amount = items_price * 0.08;
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
      status: 'ORDER_PLACED',
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
    let redirectUrl: string | null = null;
    let bankingInfo = null;

    const amount = order.total_price || 0;

    const newPayment = await Payment.create({
      orderId: order._id,
      payment_method,
      payment_status: 'UNPAID',
      amount,
      transaction_code: null,
      bankingInfo: null,
    });

    const paymentTransactionId = newPayment._id.toString();

    if (payment_method === 'BANKING') {
      const bank_name = 'Vietcombank';
      const bank_code = '970436';
      const account_number = '0123456789';
      const account_name = 'Công ty TNHH BeefBeef';
      const transfer_note = `ORDER-${order._id}`;

      const qrRes = await axios.post('https://api.vietqr.io/v2/generate', {
        accountNo: account_number,
        accountName: account_name,
        acqId: bank_code,
        amount,
        addInfo: transfer_note,
        format: 'base64',
      });

      const qr_base64 = qrRes?.data?.data?.qrDataURL;

      bankingInfo = {
        bank_name,
        account_number,
        account_name,
        qr_code: qr_base64,
        transfer_note,
      };
      await Payment.findByIdAndUpdate(paymentTransactionId, { bankingInfo });
    }

    switch (payment_method) {
      case 'MOMO':
        redirectUrl = await createMomoPaymentUrl(order, 'wallet', paymentTransactionId);
        break;
      case 'MOMO_ATM':
        redirectUrl = await createMomoPaymentUrl(order, 'atm', paymentTransactionId);
        break;
      case 'VNPAY':
        redirectUrl = createVNPayPaymentUrl(order, clientIp, paymentTransactionId);
        break;
      case 'CREDIT_CARD':
        const orderWithItems = await this.getOrderById(order._id);
        redirectUrl = await createPayPalOrder(orderWithItems as any, paymentTransactionId);
        break;
      default:
        redirectUrl = null;
        break;
    }

    return {
      type: payment_method,
      redirectUrl,
      bankingInfo,
      orderTotal: order.total_price,
    };
  }

  async markPaymentPaid(
    paymentId: string,
    paidAmount: number,
    transactionCode: string,
    userId: string | null,
  ) {
    const payment = await Payment.findById(paymentId);
    if (!payment) throw new Error('Payment not found');

    const allowedDifference = 1000;

    if (Math.abs((payment.amount || 0) - paidAmount) > allowedDifference) {
      throw new Error('Paid amount does not match expected payment amount');
    }

    payment.payment_status = 'PAID';
    payment.payment_date = new Date();
    payment.transaction_code = transactionCode;
    payment.amount = paidAmount;

    if (userId) {
      payment.confirmed_by = new mongoose.Types.ObjectId(userId);
    }

    await payment.save();

    const order = await Order.findById(payment.orderId);
    if (!order) throw new Error('Order not found');

    if (order.payment_status !== 'PAID') {
      order.payment_status = 'PAID';
      order.paid_at = new Date();
      await order.save();
    }

    return { order, payment };
  }

  async markPaymentFailed(paymentId: string, reason?: string) {
    const payment = await Payment.findById(paymentId);
    if (!payment) throw new Error('Payment not found');

    payment.payment_status = 'FAILED';
    payment.payment_date = new Date();
    payment.failure_reason = reason || 'Unknown failure';
    await payment.save();

    const order = await Order.findById(payment.orderId);
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
      shipping_fee,
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
        shipping_fee,
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

  async changePaymentMethod(orderId: string, paymentMethod: string, userId: string) {
    if (!orderId || !paymentMethod) {
      throw new Error('Missing orderId or paymentMethod');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await Order.findById(orderId).session(session);
      if (!order) throw new Error('Order not found');

      if (order.user_id.toString() !== userId) {
        throw new Error('Not authorized to change this order');
      }

      const invalidStatuses = ['PAID', 'CANCELLED', 'COMPLETED', 'RETURNED'];
      if (
        invalidStatuses.includes(order.payment_status) ||
        invalidStatuses.includes(order.status) ||
        order.status === 'CANCELLED'
      ) {
        throw new Error(
          'Cannot change payment method for paid, cancelled, completed or returned orders',
        );
      }

      const validMethods = ['CASH', 'VNPAY', 'MOMO', 'CREDIT_CARD', 'BANKING', 'MOMO_ATM'];
      if (!validMethods.includes(paymentMethod)) {
        throw new Error('Invalid payment method');
      }

      if (order.payment_method === paymentMethod) {
        await session.commitTransaction();
        session.endSession();
        return order;
      }

      const payments = await Payment.find({
        orderId: orderId,
        payment_status: { $in: ['UNPAID', 'PENDING', 'FAILED'] },
      }).session(session);

      if (payments.length > 0) {
        for (const payment of payments) {
          payment.payment_method = paymentMethod as
            | 'CASH'
            | 'BANKING'
            | 'VNPAY'
            | 'MOMO'
            | 'MOMO_ATM'
            | 'CREDIT_CARD';
          await payment.save({ session });
        }
      } else {
        await Payment.create(
          [
            {
              orderId: order._id,
              payment_method: paymentMethod as
                | 'CASH'
                | 'BANKING'
                | 'VNPAY'
                | 'MOMO'
                | 'MOMO_ATM'
                | 'CREDIT_CARD',
              payment_status: 'UNPAID',
              amount: order.total_price,
              transaction_code: null,
              bankingInfo: null,
            },
          ],
          { session },
        );
      }

      order.payment_method = paymentMethod as
        | 'CASH'
        | 'BANKING'
        | 'VNPAY'
        | 'MOMO'
        | 'MOMO_ATM'
        | 'CREDIT_CARD';
      order.payment_status = 'UNPAID';
      await order.save({ session });

      await session.commitTransaction();
      session.endSession();

      return order;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
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

      const payments = await Payment.find({ orderId }).sort({ createdAt: -1 }).lean();
      const payment = payments[0];

      let postPayment = null;
      if (payment?.payment_method === 'BANKING' && payment?.bankingInfo) {
        postPayment = {
          paymentId: payment._id,
          bankingInfo: payment.bankingInfo,
          type: payment.payment_method,
          orderTotal: order.total_price,
        };
      }

      return {
        ...order,
        order_items: orderItems,
        postPayment,
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
      const validStatuses: string[] = Object.values(Status);
      if (!validStatuses.includes(status)) {
        throw { statusCode: 400, message: 'Invalid delivery status' };
      }

      // Restrict admin updates to admin-relevant statuses
      const adminStatuses = [
        Status.ORDER_CONFIRMED,
        Status.PENDING_PICKUP,
        Status.PICKED_UP,
        Status.IN_TRANSIT,
        Status.DELIVERED,
        Status.DELIVERY_FAILED,
        Status.RETURN_APPROVED,
        Status.RETURN_REJECTED,
        Status.RETURNED,
      ];
      if (!adminStatuses.includes(status as Status)) {
        throw { statusCode: 403, message: 'Status not allowed for admin update' };
      }

      // Define valid status transitions
      const validTransitions: { [key: string]: string[] } = {
        [Status.ORDER_PLACED]: [Status.ORDER_CONFIRMED, Status.CANCELLED],
        [Status.ORDER_CONFIRMED]: [Status.PENDING_PICKUP],
        [Status.PENDING_PICKUP]: [Status.PICKED_UP, Status.IN_TRANSIT],
        [Status.PICKED_UP]: [Status.IN_TRANSIT],
        [Status.IN_TRANSIT]: [Status.DELIVERED, Status.DELIVERY_FAILED],
        [Status.DELIVERED]: [Status.RETURN_REQUESTED],
        [Status.DELIVERY_FAILED]: [Status.PENDING_PICKUP, Status.CANCELLED],
        [Status.RETURN_REQUESTED]: [Status.RETURN_APPROVED, Status.RETURN_REJECTED],
        [Status.RETURN_APPROVED]: [Status.RETURNED],
        [Status.RETURN_REJECTED]: [], 
        [Status.RETURNED]: [],
        [Status.CANCELLED]: [],
      };

      if (validTransitions[order.status] && !validTransitions[order.status].includes(status)) {
        throw {
          statusCode: 400,
          message: `Không thể chuyển từ trạng thái "${this.getStatusText(
            order.status,
          )}" sang "${this.getStatusText(status)}"`,
        };
      }

      order.status = status as
        | 'ORDER_PLACED'
        | 'ORDER_CONFIRMED'
        | 'PENDING_PICKUP'
        | 'PICKED_UP'
        | 'IN_TRANSIT'
        | 'DELIVERED'
        | 'DELIVERY_FAILED'
        | 'RETURN_REQUESTED'
        | 'RETURN_APPROVED'
        | 'RETURN_REJECTED'
        | 'RETURNED'
        | 'CANCELLED';      
      if (status === Status.DELIVERED) {
        if (order.payment_status !== 'PAID') {
          throw {
            statusCode: 400,
            message: 'Không thể chuyển sang trạng thái " ĐÃ GIAO HÀNG " khi đơn hàng chưa thanh toán',
          };
        }
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

  // mapDeliveryStatusToOrderStatus(
  //   deliveryStatus: Status,
  //   orderType: 'DINE_IN' | 'ONLINE',
  // ): OrderStatus {
  //   if (orderType === 'DINE_IN') {
  //     switch (deliveryStatus) {
  //       case Status.PENDING_PICKUP:
  //         return OrderStatus.PREPARING;
  //       case Status.PICKED_UP:
  //       case Status.IN_TRANSIT:
  //         return OrderStatus.SHIPPING;
  //       case Status.DELIVERED:
  //         return OrderStatus.COMPLETED;
  //       case Status.DELIVERY_FAILED:
  //         return OrderStatus.PENDING;
  //       case Status.RETURN_REQUESTED:
  //       case Status.RETURNED:
  //         return OrderStatus.RETURNED;
  //       case Status.CANCELLED:
  //         return OrderStatus.CANCELLED;
  //       default:
  //         return OrderStatus.PENDING;
  //     }
  //   } else if (orderType === 'ONLINE') {
  //     switch (deliveryStatus) {
  //       case Status.PENDING:
  //         return OrderStatus.PENDING;
  //       case Status.PENDING_PICKUP:
  //         return OrderStatus.PREPARING;
  //       case Status.PICKED_UP:
  //       case Status.IN_TRANSIT:
  //         return OrderStatus.SHIPPING;
  //       case Status.DELIVERED:
  //         return OrderStatus.COMPLETED;
  //       case Status.DELIVERY_FAILED:
  //         return OrderStatus.CANCELLED;
  //       case Status.RETURN_REQUESTED:
  //       case Status.RETURNED:
  //         return OrderStatus.RETURNED;
  //       case Status.CANCEL_REQUESTED:
  //         return OrderStatus.CANCEL_REQUESTED;
  //       case Status.CANCELLED:
  //         return OrderStatus.CANCELLED;
  //       default:
  //         return OrderStatus.PENDING;
  //     }
  //   }

  //   return OrderStatus.PENDING;
  // }

  async cancelOrder(orderId: mongoose.Types.ObjectId, reason: string) {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw { statusCode: 404, message: 'Order not found' };
      }

      if (order.status !== 'ORDER_PLACED') {
        throw {
          statusCode: 400,
          message: 'Order can only be cancelled when status and status are PENDING',
        };
      }

      order.status = 'CANCELLED';
      order.status = 'CANCELLED';
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

      if (order.status !== 'DELIVERED') {
        throw {
          statusCode: 400,
          message: 'Return can only be requested when status is DELIVERED',
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
      order.status = Status.RETURN_REQUESTED.toString() as any;
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

  // async requestCancel(orderId: mongoose.Types.ObjectId, reason: string) {
  //   try {
  //     const order = await Order.findById(orderId);
  //     if (!order) {
  //       throw { statusCode: 404, message: 'Order not found' };
  //     }

  //     if (order.status !== 'PREPARING' || order.delivery_status !== 'PENDING_PICKUP') {
  //       throw {
  //         statusCode: 400,
  //         message:
  //           'Cancel request chỉ được phép khi status = PREPARING và delivery_status = PENDING_PICKUP',
  //       };
  //     }
  //     order.status = 'CANCEL_REQUESTED';
  //     order.delivery_status = 'CANCEL_REQUESTED';
  //     order.cancelled_at = new Date();
  //     order.cancelled_reason = reason;
  //     await order.save();
  //     return order;
  //   } catch (error: any) {
  //     throw {
  //       statusCode: error.statusCode || 500,
  //       message: error.message || 'Error requesting cancel',
  //     };
  //   }
  // }

  async sendOrderConfirmationEmail(orderId: Types.ObjectId) {
    const order = await Order.findById(orderId)
      .populate('user_id', 'email name')
      .populate('address_id')
      .lean();
  
    if (!order) throw new Error('Order not found');
  
    const items = await OrderDetail.find({ order_id: orderId }).lean();
  
    const user = order.user_id as unknown as IUser;
    const receiver = order.address_id as unknown as IAddress;
  
    await MailerService.sendOrderConfirmation({
      ...(order as any),
      user,
      receiverInfo: receiver,
      items: items as any,
    });
    
  }
  
  
}

export default new OrderService();
