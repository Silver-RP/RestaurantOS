import { Request, Response, NextFunction } from 'express';
import OrderService from '../services/OrderService';
import { IUser } from '../models/UserModel';
import { Types } from 'mongoose';
import OrderValidate from '../validators/orderValidator';

class OrderController {
  async placeOrder(req: Request, res: Response): Promise<any> {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const validation = OrderValidate.validatePlaceOrder(req);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      const userId = (req.user as IUser).id as Types.ObjectId;
      const {
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
      } = req.body;

      const order = await OrderService.placeOrder({
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
      });

      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
      const postPayment = await OrderService.handlePostPaymentLogic(order, clientIp.toString());

      return res.status(201).json({
        message: 'Order placed successfully',
        order,
        postPayment,
      });
    } catch (error: any) {
      console.error('Error placing order:', error.message);
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message || 'Internal Server Error' });
    }
  }

  async getAllOrders(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', filters } = req.query;
      const parsedSortOrder: 1 | -1 = sortOrder === 'asc' ? 1 : -1;
      const parsedPage = parseInt(page as string, 10);
      const parsedLimit = parseInt(limit as string, 10);
      const filtersObject = filters ? (filters as { [key: string]: string }) : {};

      const options = {
        page: parsedPage,
        limit: parsedLimit,
        sortBy: sortBy as string,
        sortOrder: parsedSortOrder,
        filters: filtersObject,
      };

      const orders = await OrderService.getAllOrders(options);

      return res.status(200).json({
        message: 'Orders retrieved successfully',
        ...orders,
      });
    } catch (error: any) {
      console.error('Error retrieving orders:', error.message);
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message || 'Internal Server Error' });
    }
  }

  async getUserOrders(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const userId = (req.user as IUser).id as Types.ObjectId;
      const deliveryStatuses = req.query.delivery_status
        ? Array.isArray(req.query.delivery_status)
          ? req.query.delivery_status
          : [req.query.delivery_status]
        : null;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
      const cleanDeliveryStatuses = deliveryStatuses?.filter(
        (status): status is string => typeof status === 'string'
      ) ?? null;

      const result = await OrderService.getUserOrders(userId, cleanDeliveryStatuses, page, limit);

      return res.status(200).json({
        message: 'Orders retrieved successfully',
        ...result,
      });
    } catch (error: any) {
      console.error('Error retrieving orders:', error.message);
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message || 'Internal Server Error' });
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const orderId = new Types.ObjectId(req.params.id);
      const order = await OrderService.getOrderById(orderId);

      // console.log('Retrieved order:', order);
      return res.status(200).json({
        message: 'Order retrieved successfully',
        order,
      });
    } catch (error: any) {
      console.error('Error retrieving order:', error.message);
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message || 'Internal Server Error' });
    }
  }

  async updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const orderId = new Types.ObjectId(req.params.id);
      const { status } = req.body;

      // Validate status
      const validStatuses = [
        'ORDER_PLACED',
        'ORDER_CONFIRMED',
        'PENDING',
        'PENDING_PICKUP',
        'PICKED_UP',
        'IN_TRANSIT',
        'DELIVERED',
        'DELIVERY_FAILED',
        'RETURN_REQUESTED',
        'CANCEL_RETURN_REQUESTED',
        'RETURN_APPROVED',
        'RETURN_REJECTED',
        'RETURNED',
        'CANCEL_REQUESTED',
        'CANCELLED',
      ];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: 'Invalid status value',
        });
      }

      const updatedOrder = await OrderService.updateOrderStatus(orderId, status);

      return res.status(200).json({
        message: 'Order status updated successfully',
        order: updatedOrder,
      });
    } catch (error: any) {
      console.error('Error updating order status:', error.message);
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message || 'Internal Server Error' });
    }
  }

  async cancelOrder(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const orderId = new Types.ObjectId(req.params.id);
      const { reason } = req.body;
      const updatedOrder = await OrderService.cancelOrder(orderId, reason);

      return res.status(200).json({
        message: 'Order cancelled successfully',
        order: updatedOrder,
      });
    } catch (error: any) {
      console.error('Error cancelling order:', error.message);
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message || 'Internal Server Error' });
    }
  }

  async requestReturn(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const orderId = new Types.ObjectId(req.params.id);
      const { reason } = req.body;
      const updatedOrder = await OrderService.requestReturn(orderId, reason);

      return res.status(200).json({
        message: 'Return requested successfully',
        order: updatedOrder,
      });
    } catch (error: any) {
      console.error('Error requesting return:', error.message);
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message || 'Internal Server Error' });
    }
  }

  async requestCancel(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const orderId = new Types.ObjectId(req.params.id);
      const { reason } = req.body;
      const updatedOrder = await OrderService.requestCancel(orderId, reason);

      return res.status(200).json({
        message: 'Cancel requested successfully',
        order: updatedOrder,
      });
    } catch (error: any) {
      console.error('Error requesting cancel:', error.message);
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message || 'Internal Server Error' });
    }
  }
}

export default new OrderController();
