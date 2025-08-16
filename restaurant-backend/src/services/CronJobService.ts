import mongoose from 'mongoose';
import { Order, IOrder } from '../models/OrderModel';
import Payment from '../models/PaymentModel';
import cron from 'node-cron';
import MailerService from './MailerService';
import User from '../models/UserModel';
import { Dish } from '../models/DishModel';
import PostsService from './PostsServices';
import { OrderDetail } from '../models/OrderDetailModel';
import { Reservation } from '../models/ReservationModel';
import { TableReservationStatus } from '../models/TableReservationStatusModel';

class CronJobService {
  private cancelOrderTask: any;
  private publishPostTask: any;
  private cancelReservationTask: any;
  private resetHeldTableTask: any;
  private checkDishesStatusTask: any;
  constructor() {
    // Cron job hủy đơn hàng chưa thanh toán trong 30 phút
    this.cancelOrderTask = cron.schedule('* * * * *', async () => {
      console.log('Chạy cron job kiểm tra đơn hàng chưa thanh toán...');
      await this.cancelUnpaidOrders();
    });

    this.cancelReservationTask = cron.schedule('*/60 * * * * *', async () => {
      console.log('Chạy cron job kiểm tra đơn đặt bàn quá hạn...');
      await this.cancelPendingReservations();
    });

    this.resetHeldTableTask = cron.schedule('*/15 * * * *', async () => {
      await this.resetExpiredHeldTables();
    });

    // Cron job for publishing scheduled posts (e.g., every minute)
    this.publishPostTask = cron.schedule('* * * * *', async () => {
      console.log('Chạy cron job kiểm tra bài viết đã lên lịch...');
      try {
        const result = await PostsService.publishScheduledPosts();
        if (result.modifiedCount > 0) {
          console.log(`Đã đăng thành công ${result.modifiedCount} bài viết đã lên lịch.`);
        } else {
          console.log('Không có bài viết nào cần đăng theo lịch.');
        }
      } catch (error: any) {
        console.error('Lỗi trong cron job đăng bài viết đã lên lịch:', error.message);
      }
    });

    this.checkDishesStatusTask = cron.schedule('0 0 * * *', async () => {
      console.log('🆕/⭐/💸 Chạy cron job kiểm tra hạn Dish: new/recommend/discount...');
      await this.checkDiscountUntil();
      await this.checkNewUntil();
      await this.checkRecommendUntil();
    });
  }

  // Hàm kiểm tra và hủy đơn hàng chưa thanh toán
  private async cancelUnpaidOrders() {
    try {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

      // Tìm các đơn hàng chưa thanh toán với phương thức thanh toán online
      const unpaidOrders = await Order.find({
        payment_method: { $ne: 'CASH' },
        payment_status: 'UNPAID',
        status: 'ORDER_PLACED',
        order_type: 'ONLINE',
        createdAt: { $lte: thirtyMinutesAgo },
      });

      for (const order of unpaidOrders) {
        // Bắt đầu transaction để đảm bảo tính toàn vẹn dữ liệu
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
          // Cập nhật trạng thái đơn hàng sang CANCELLED
          order.status = 'CANCELLED';
          order.cancelled_at = new Date();
          order.cancelled_reason = 'Đơn hàng bị hủy do không thanh toán trong 30 phút';
          await order.save({ session }); // Cập nhật trạng thái thanh toán sang FAILED
          const payment = await Payment.findOne({ orderId: order._id }).session(session);
          if (payment) {
            payment.payment_status = 'FAILED';
            payment.failure_reason = 'Hết thời gian thanh toán';
            await payment.save({ session });
          }

          // Gửi email thông báo hủy đơn hàng
          await this.sendCancellationEmail(order);
          await session.commitTransaction();

          console.log(`Đã hủy đơn hàng ${order._id} do không thanh toán trong thời hạn`);
        } catch (error: any) {
          await session.abortTransaction();
          console.error(`Lỗi khi hủy đơn hàng ${order._id}:`, error.message);
        } finally {
          session.endSession();
        }
      }

      console.log(`Đã kiểm tra và xử lý ${unpaidOrders.length} đơn hàng chưa thanh toán.`);
    } catch (error: any) {
      console.error('Lỗi trong cron job hủy đơn hàng:', error.message);
    }
  }

  // Hàm gửi email thông báo hủy đơn hàng
  private async sendCancellationEmail(order: IOrder) {
    try {
      const user = await User.findById(order.user_id).lean();
      if (!user || !user.email) {
        console.error(`Không tìm thấy người dùng hoặc email cho đơn hàng ${order._id}`);
        return;
      }

      // Populate address_id và lấy order_items
      const populatedOrder = await Order.findById(order._id).populate('address_id').lean();
      const order_items = await OrderDetail.find({ order_id: order._id }).lean();

      await MailerService.sendOrderCancellation({
        order: { ...populatedOrder, order_items } as any, // ép kiểu cho đúng IOrderPopulated
        userEmail: user.email,
        reason: order.cancelled_reason || 'Không thanh toán trong thời gian quy định',
      });
    } catch (error: any) {
      console.error(`Lỗi khi gửi email thông báo hủy đơn hàng ${order._id}:`, error.message);
    }
  }

  // Hàm hủy đơn đặt bàn sau 30 phút chưa xác nhận
  private async cancelPendingReservations() {
    try {
      const expireTime = new Date(Date.now() - 5 * 60 * 1000); // 1 phút trước (dùng cho development)
      // const expireTime = new Date(Date.now() - 60 * 60 * 1000); // 60 phút trước (dùng cho production)

      const pendingReservations = await Reservation.find({
        status: 'PENDING',
        createdAt: { $lte: expireTime },
      });

      for (const reservation of pendingReservations) {
        reservation.status = 'CANCELLED';
        reservation.cancelled_reason = 'Không thanh toán phần đặt bàn trong thời gian quy định';
        reservation.cancelled_at = new Date();
        await reservation.save();

        // Cập nhật trạng thái bàn tương ứng để cho phép người khác đặt lại
        await TableReservationStatus.updateMany(
          { reservation_id: reservation._id },
          {
            $set: {
              status: 'holding',
              heldBy: null,
              reservation_id: null,
              expireAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
          },
        );

        await this.sendReservationCancellationEmail(reservation);

        // Gửi email nếu cần:
        // await MailerService.sendReservationCancellation(...)

        console.log(`Đã hủy đơn đặt bàn ${reservation._id}`);
      }

      console.log(`Đã xử lý ${pendingReservations.length} đơn đặt bàn quá hạn.`);
    } catch (error: any) {
      console.error('Lỗi khi hủy đơn đặt bàn:', error.message);
    }
  }

  private async resetExpiredHeldTables() {
    try {
      const result = await TableReservationStatus.deleteMany({
        status: 'holding',
        reservation_id: null,
      });

      if (result.deletedCount && result.deletedCount > 0) {
        console.log(`Đã xoá ${result.deletedCount} bản ghi bàn giữ quá hạn.`);
      }
    } catch (error: any) {
      console.error('Lỗi khi xoá các bản ghi bàn giữ quá hạn:', error.message);
    }
  }

  // Hàm gửi email thông báo hủy đặt bàn
  private async sendReservationCancellationEmail(reservation: any) {
    try {
      const user = await User.findById(reservation.user_id).lean();
      if (!user || !user.email) {
        console.error(`Không tìm thấy người dùng hoặc email cho đơn đặt bàn ${reservation._id}`);
        return;
      }

      await MailerService.sendReservationCancellation({
        reservation,
        userEmail: user.email,
        reason: reservation.cancelled_reason || 'Không xác nhận trong thời gian quy định',
      });
    } catch (error: any) {
      console.error(`Lỗi khi gửi email hủy đặt bàn ${reservation._id}:`, error.message);
    }
  }

  private async checkDiscountUntil() {
    try {
      const now = new Date();
      const expiredDishes = await Dish.find({
        discountUntil: { $lte: now },
        discount_price: { $ne: null }
      });

      if (expiredDishes.length === 0) return;

      for (const dish of expiredDishes) {
        dish.discount_price = null || 0; 
        await dish.save();
      }

      console.log(`💸: Đã xử lý ${expiredDishes.length} món hết hạn discount.`);
    } catch (err: any) {
      console.error('Lỗi trong checkDiscountUntil:', err.message);
    }
  }

  private async checkNewUntil() {
    try {
      const now = new Date();
      const expiredNewDishes = await Dish.find({
        newUntil: { $lte: now },
        isDishNew: true
      });

      if (expiredNewDishes.length === 0) return;

      for (const dish of expiredNewDishes) {
        dish.isDishNew = false;
        await dish.save();
      }

      console.log(`🆕: Đã xử lý ${expiredNewDishes.length} món hết hạn "mới".`);
    } catch (err: any) {
      console.error('Lỗi trong checkNewUntil:', err.message);
    }
  }

  private async checkRecommendUntil() {
    try {
      const now = new Date();
      const expiredRecommendDishes = await Dish.find({
        recommendUntil: { $lte: now },
        isRecommend: true
      });

      if (expiredRecommendDishes.length === 0) return;

      for (const dish of expiredRecommendDishes) {
        dish.isRecommend = false;
        await dish.save();
      }

      console.log(`⭐: Đã xử lý ${expiredRecommendDishes.length} món hết hạn recommend.`);
    } catch (err: any) {
      console.error('Lỗi trong checkRecommendUntil:', err.message);
    }
  }

  public start() {
    this.cancelOrderTask.start();
    this.publishPostTask.start();
    this.cancelReservationTask.start();
    this.resetHeldTableTask.start();
    this.checkDishesStatusTask.start();
  }

  public stop() {
    this.cancelOrderTask.stop();
    this.publishPostTask.stop();
    this.cancelReservationTask.stop();
    this.resetHeldTableTask.stop();
    this.checkDishesStatusTask.stop();
  }
}

export default new CronJobService();
