import { Reservation } from '../models/ReservationModel';
import { ReservationDetail } from '../models/ReservationDetailModel';
import { Types } from 'mongoose';
import { Dish } from '../models/DishModel';
import MailerService from './MailerService';
import TableReservationService from './TableReservationService';
import { IUser } from '../models/UserModel';
import { Table } from '../models/TableModel';

class ReservationService {
  async createReservation(data: any, userId: Types.ObjectId | null) {
    try {
      const {
        full_name,
        phone,
        date,
        time,
        table_type,
        number_of_people,
        table_code,
        note,
        is_choose_later,
        email,
        selectedItems = [],
        deposit,
        room_type,
      } = data;

      console.log('[ReservationService] Bắt đầu tạo reservation với data:', data);

      const newReservation = new Reservation({
        user_id: userId, // Có thể là null cho khách không đăng nhập
        full_name,
        phone,
        date,
        time,
        table_type,
        number_of_people,
        note,
        is_choose_later,
        status: 'PENDING',
        deposit,
        room_type,
      });

      let savedReservation;
      try {
        savedReservation = await newReservation.save();
        console.log('[ReservationService] Đã lưu reservation:', savedReservation?._id);
      } catch (err) {
        console.error('[ReservationService] Lỗi khi lưu reservation:', err);
        throw err;
      }

      // giữ bàn nếu có table_code (bàn đã được hold từ Step2Seating)
      // if (table_code) {
      //   try {
      //     // Sử dụng userId hoặc một ID tạm thời cho khách không đăng nhập
      //     const holdUserId =
      //       userId || `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      //     await TableReservationService.holdTable(table_code, holdUserId, date, time);
      //     console.log('[ReservationService] Đã giữ bàn thành công:', table_code);
      //   } catch (holdErr) {
      //     console.error('[ReservationService] Lỗi khi giữ bàn:', holdErr);
      //     if (savedReservation && savedReservation._id) {
      //       const reservationId = typeof savedReservation._id === 'string'
      //         ? savedReservation._id
      //         : (savedReservation._id as Types.ObjectId).toString();
      //       await Reservation.findByIdAndDelete(reservationId); // rollback
      //     }
      //     throw new Error('Không thể giữ bàn');
      //   }
      // }

      if (Array.isArray(selectedItems) && selectedItems.length > 0) {
        try {
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
          console.log('[ReservationService] Đã lưu chi tiết món ăn:', detailDocs.length);
        } catch (err) {
          console.error('[ReservationService] Lỗi khi lưu chi tiết món ăn:', err);
          throw err;
        }
      }

      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        try {
          const reservationItems = await ReservationDetail.find({
            reservation_id: savedReservation._id,
          }).lean();

          // Lấy tên loại bàn hiển thị
          let seatingTypeDisplay = table_type;
          if (table_code) {
            const table = await Table.findOne({ code: table_code }).lean();
            if (table) {
              let typeName = '';
              switch (table.type) {
                case 'standard':
                  typeName = 'Bàn thường';
                  break;
                case 'group':
                  typeName = 'Bàn nhóm';
                  break;
                case 'quiet':
                  typeName = 'Bàn yên tĩnh';
                  break;
                case 'vip':
                  typeName = 'Bàn VIP';
                  break;
                default:
                  typeName = table.type;
              }
              seatingTypeDisplay = `${table.code} (${typeName})`;
            }
          }

          const emailData = {
            _id: savedReservation._id.toString(),
            user: { email } as IUser,
            full_name,
            phone,
            email,
            time,
            date,
            seating_type: seatingTypeDisplay,
            table_count: 1,
            number_of_people: number_of_people,
            note,
            items: reservationItems.map((item) => ({
              name: item.dish_name,
              quantity: item.quantity,
              price: item.unit_price,
            })),
          };

          await MailerService.sendReservationConfirmation(emailData);
          console.log('[ReservationService] Đã gửi email xác nhận.');
        } catch (emailError) {
          console.error('[ReservationService] Lỗi khi gửi email:', emailError);
          // Không throw để không chặn tạo đơn
        }
      }
      console.log('[ReservationService] Hoàn tất tạo reservation:', savedReservation?._id);
      return savedReservation;
    } catch (error: any) {
      console.error('❌ Error in createReservation:', error);
      throw new Error('Không thể tạo đơn đặt bàn');
    }
  }

  async confirmReservation(reservationId: Types.ObjectId, userId: Types.ObjectId | null) {
    try {
      const reservation = await Reservation.findById(reservationId);
      if (!reservation) {
        throw new Error('Không tìm thấy reservation');
      }

      reservation.status = 'CONFIRMED';
      await reservation.save();

      if (reservation.table_type) {
        try {
          const table_code = reservation.table_type;
          const holdUserId =
            userId || `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

          await TableReservationService.bookTable(
            table_code,
            holdUserId,
            reservationId,
            reservation.date,
            reservation.time,
          );
          console.log('[ReservationService] Đã chuyển bàn thành booked:', table_code);
        } catch (bookErr) {
          console.error('[ReservationService] Lỗi khi chuyển bàn thành booked:', bookErr);
        }
      }

      return reservation;
    } catch (error) {
      console.error('[ReservationService] Lỗi khi confirm reservation:', error);
      throw error;
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
