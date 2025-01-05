import ReservationDetailContact from "../models/ReservationDetailContactModel";
import { IReservationDetailContact } from "../models/ReservationDetailContactModel";
class ReservationDetailContactService {
    async createReservationDetailContact (input: IReservationDetailContact): Promise<any> {
        const reservationDetailContact = await ReservationDetailContact.create(input); 
        await reservationDetailContact.save(); 
        return reservationDetailContact;
    }
    async getAllReservationDetailContact (): Promise<any> {
        const reservationDetailContact = await ReservationDetailContact.find({}).populate("reservation", "tableType").populate("user", "userName phone"); 
        return reservationDetailContact;
    }

}
export default new ReservationDetailContactService();