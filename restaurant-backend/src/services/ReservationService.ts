import { Reservation } from '../models/ReservationModel';
import { ReservationDetail } from '../models/ReservationDetailModel';
import { Types } from 'mongoose';
import { Dish } from '../models/DishModel';
import nodemailer from 'nodemailer';
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
      if (email) {
        await this.sendReservationConfirmationEmail(email, full_name, {
          date,
          time,
          tableType: table_type,
          people: number_of_people,
          note,
          reservationId: savedReservation._id.toString(),
        });
      }

      return savedReservation;
    } catch (error) {
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
    console.log('[Service] query:', query);
    console.log('[Service] skip:', skip, '| limit:', limit);
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

    // Gắn thêm ảnh đại diện cho mỗi món ăn
    const detailsWithImages = await Promise.all(
      details.map(async (item) => {
        let image: string | null = null;

        try {
          const dish = await Dish.findById(item.dish_id, 'images').lean();
          image = dish?.images?.[0] || null;
        } catch {
          console.warn('Không tìm thấy ảnh cho món:', item.dish_id);
        }

        return { ...item, image };
      }),
    );

    return { ...reservation, details: detailsWithImages };
  }

  sendReservationConfirmationEmail = async (
    toEmail: string,
    fullName: string,
    reservationInfo: {
      date: string;
      time: string;
      tableType: string;
      people: number;
      note?: string;
      reservationId: string;
    },
  ) => {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      });

      const htmlContent = `
      <h2>Xin chào ${fullName},</h2>
      <p>Đơn đặt bàn của bạn đã được ghi nhận với thông tin sau:</p>
      <ul>
        <li><strong>Ngày:</strong> ${reservationInfo.date}</li>
        <li><strong>Giờ:</strong> ${reservationInfo.time}</li>
        <li><strong>Loại bàn:</strong> ${reservationInfo.tableType}</li>
        <li><strong>Số người:</strong> ${reservationInfo.people}</li>
        <li><strong>Ghi chú:</strong> ${reservationInfo.note || 'Không có'}</li>
        <li><strong>Mã đơn:</strong> ${reservationInfo.reservationId}</li>
      </ul>
      <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
    `;

      await transporter.sendMail({
        from: `"BeefBeef Restaurant" <${process.env.MAIL_USERNAME}>`,
        to: toEmail,
        subject: 'Xác nhận đơn đặt bàn',
        html: htmlContent,
      });

      console.log('📧 Email xác nhận đã gửi đến:', toEmail);
    } catch (err) {
      console.error('❌ Gửi email thất bại:', err);
    }
  };

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
