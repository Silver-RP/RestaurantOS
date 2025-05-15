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
      });

      return res.status(201).json({
        message: 'Order placed successfully',
        order,
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
        orders,
      });
    } catch (error: any) {
      console.error('Error retrieving orders:', error.message);
      next(error);
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
      const status = typeof req.query.status === 'string' ? req.query.status : null;
      const orders = await OrderService.getUserOrders(userId, status);

      return res.status(200).json({
        message: 'Orders retrieved successfully',
        orders,
      });
    } catch (error: any) {
      console.error('Error retrieving orders:', error.message);
      next(error);
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message || 'Internal Server Error' });
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const orderId = new Types.ObjectId(req.params.id);
      const order = await OrderService.getOrderById(orderId);

      return res.status(200).json({
        message: 'Order retrieved successfully',
        order,
      });
    } catch (error: any) {
      console.error('Error retrieving order:', error.message);
      next(error);
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message || 'Internal Server Error' });
    }
  }

  async updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const orderId = new Types.ObjectId(req.params.id);
      const { status } = req.body;

      const updatedOrder = await OrderService.updateOrderStatus(orderId, status);

      return res.status(200).json({
        message: 'Order status updated successfully',
        order: updatedOrder,
      });
    } catch (error: any) {
      console.error('Error updating order status:', error.message);
      next(error);
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message || 'Internal Server Error' });
    }
  }
}

export default new OrderController();
