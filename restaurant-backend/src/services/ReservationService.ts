import { Reservation } from '../models/ReservationModel';
import { ReservationDetail } from '../models/ReservationDetailModel';
import { Types } from 'mongoose';
import { Dish } from '../models/DishModel';
import MailerService from './MailerService';

class ReservationService {
  async createReservation(data: any, userId: Types.ObjectId) {
    try {
      const {
        full_name,
        phone,
        date,
        time,
        table_type,
        number_of_people,
        note,
        is_choose_later,
        email,
        selectedItems = [],
      } = data;

      const newReservation = new Reservation({
        user_id: userId,
        full_name,
        phone,
        date,
        time,
        table_type,
        number_of_people,
        note,
        is_choose_later,
        status: 'PENDING',
      });

      const savedReservation = await newReservation.save();

      if (Array.isArray(selectedItems) && selectedItems.length > 0) {
        const detailDocs = selectedItems.map((item: any) => ({
          reservation_id: savedReservation._id,
          dish_id: item.id,
          dish_name: item.name,
          category: item.category,
          unit_price: item.price,
          quantity: item.quantity,
          total_amount: item.price * item.quantity,
          note: item.note || '',
        }));

        await ReservationDetail.insertMany(detailDocs);
      }

      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        console.log('📧 Starting email sending process for reservation:', savedReservation._id);

        const reservationItems = await ReservationDetail.find({
          reservation_id: savedReservation._id,
        }).lean();
        console.log('📦 Found reservation items:', reservationItems);

        const emailData = {
          _id: savedReservation._id.toString(),
          user: { email } as IUser,
          full_name,
          phone,
          email,
          time,
          date,
          seating_type: table_type,
          table_count: 1,
          note,
          items: reservationItems.map((item) => ({
            name: item.dish_name,
            quantity: item.quantity,
            price: item.unit_price,
          })),
        };
        console.log('📨 Email data prepared:', emailData);

        try {
          await MailerService.sendReservationConfirmation(emailData);
          console.log('✅ Email sent successfully');
        } catch (emailError) {
          console.error('❌ Error sending email:', emailError);
          // Don't throw error here to not block reservation creation
        }
      }
      return savedReservation;
    } catch (error: any) {
      console.error('❌ Error in createReservation:', error);
      throw new Error('Không thể tạo đơn đặt bàn');
    }
  }

  getMyReservations = async (userId: Types.ObjectId, status?: string[], page = 1, limit = 5) => {
    const query: any = { user_id: userId };

    if (status && status.length > 0) {
      query.status = { $in: status };
    }

    const skip = (page - 1) * limit;
    const [reservations, totalItems] = await Promise.all([
      Reservation.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Reservation.countDocuments(query),
    ]);

    return {
      reservations,
      totalItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
    };
  };

  async getReservationById(id: string) {
    const reservation = await Reservation.findById(id).lean();
    if (!reservation) throw new Error('Không tìm thấy đơn đặt bàn');

    const details = await ReservationDetail.find({ reservation_id: id }).lean();

    const detailsWithImages = await Promise.all(
      details.map(async (item) => {
        let image: string | null = null;
        try {
          const dish = await Dish.findById(item.dish_id, 'images').lean();
          image = dish?.images?.[0] || null;
        } catch (err: any) {
          console.warn('Không tìm thấy ảnh cho món:', item.dish_id, '| Lỗi:', err?.message);
        }
        return { ...item, image };
      }),
    );

    return { ...reservation, details: detailsWithImages };
  }

  async getAllReservations() {
    return await Reservation.find().sort({ createdAt: -1 }).lean();
  }

  async updateReservationStatus(
    id: string,
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'DONE',
  ) {
    const updated = await Reservation.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) throw new Error('Không tìm thấy đơn đặt bàn để cập nhật');
    return updated;
  }

  async cancelReservation(id: string) {
    const updated = await Reservation.findByIdAndUpdate(id, { status: 'CANCELLED' }, { new: true });
    if (!updated) throw new Error('Không tìm thấy đơn để huỷ');
    return updated;
  }

  async restoreReservation(id: string) {
    const reservation = await Reservation.findById(id);
    if (!reservation) throw new Error('Không tìm thấy đơn đặt bàn');
    if (reservation.status !== 'CANCELLED') {
      throw new Error('Chỉ có thể khôi phục đơn đã huỷ');
    }
    reservation.status = 'PENDING';
    return await reservation.save();
  }
}

export default new ReservationService();
