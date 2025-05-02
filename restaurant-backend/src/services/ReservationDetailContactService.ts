import ReservationDetailContact from '../models/ReservationDetailContactModel';
import { IReservationDetailContact } from '../models/ReservationDetailContactModel';
class ReservationDetailContactService {
  async createReservationDetailContact(
    input: IReservationDetailContact,
  ): Promise<any> {
    const reservationDetailContact =
      await ReservationDetailContact.create(input);
    await reservationDetailContact.save();
    return reservationDetailContact;
  }

  async getAllReservationDetailContact(): Promise<any> {
    const reservationDetailContact = await ReservationDetailContact.find({})
      .populate('reservation', 'tableType')
      .populate('users', 'userName phone')
      .populate('foods', 'name price countInStock');
    return reservationDetailContact;
  }

  async getReservationDetailContactById(id: string): Promise<any> {
    const reservationDetailContact = await ReservationDetailContact.findById(id)
      .populate('reservation', 'tableType')
      .populate('users', 'userName phone')
      .populate('foods', 'name price countInStock');
    return reservationDetailContact;
  }

  async updateReservationDetailContact(
    id: string,
    input: IReservationDetailContact,
  ): Promise<any> {
    const reservationDetailContact =
      await ReservationDetailContact.findByIdAndUpdate(id, input, {
        new: true,
      });
    return reservationDetailContact;
  }
  async deleteReservationDetailContact(id: string): Promise<any> {
    const reservationDetailContact =
      await ReservationDetailContact.findById(id);

    // Kiểm tra xem đơn hàng có món ăn đã chọn hay không nếu lớn 0 thì không thể xóa
    if (
      reservationDetailContact &&
      reservationDetailContact.foods &&
      reservationDetailContact.foods.length > 0
    ) {
      throw new Error('Cannot delete reservation with selected foods.');
    }
    // kiểm trạng thái của đơn hàng nếu đã duyệt thì không thể xóa
    if (
      reservationDetailContact &&
      reservationDetailContact.status &&
      reservationDetailContact.status === 'approved'
    ) {
      throw new Error('Cannot delete approved reservation.');
    }

    // Nếu không có vấn đề gì, thực hiện xóa
    const deletedReservationDetailContact =
      await ReservationDetailContact.findByIdAndDelete(id);
    return deletedReservationDetailContact;
  }
}
export default new ReservationDetailContactService();
