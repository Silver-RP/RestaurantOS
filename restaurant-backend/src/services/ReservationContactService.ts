import ReservationContactModel from '../models/ReservationContactModel';
import { IReservationContact } from '../models/ReservationContactModel';
interface IReservationContactInputDTO {
  tableType: string;
  activeHours: Date;
  tableCount: number;
  location: string;
}
class ReservationContact {
  async createReservationContact(input: IReservationContactInputDTO): Promise<any> {
    const reservationcontact = await ReservationContactModel.create(input);
    await reservationcontact.save();
    return reservationcontact;
  }
  async getAllReservationContact(): Promise<any> {
    const reservationcontact = await ReservationContactModel.find({});
    return reservationcontact;
  }
  async getReservationContactById(id: string): Promise<any> {
    const reservationcontact = await ReservationContactModel.findById(id);
    return reservationcontact;
  }
  async updateReservationContact(id: string, input: IReservationContactInputDTO): Promise<any> {
    const reservationcontact = await ReservationContactModel.findByIdAndUpdate(id, input, {
      new: true,
    });
    return reservationcontact;
  }
  async deleteReservationCotact(id: string): Promise<any> {
    const reservationcontact = await ReservationContactModel.findByIdAndDelete(id);
    return { message: 'Delete success' };
  }
}
export default new ReservationContact();
