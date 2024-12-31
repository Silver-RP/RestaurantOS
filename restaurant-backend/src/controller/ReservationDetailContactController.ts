import ReservationDetailContactService from "../services/ReservationDetailContactService";
import { Request, Response } from 'express';
class ReservationDetailContactController {
    async createReservationDetailContact (req: Request, res: Response) {
        try {
            const { reservation,reservationDate, guestCount, timeReservation, status, user } = req.body;
            const reservationDetailContact = await ReservationDetailContactService.createReservationDetailContact(req.body);
            res.status(200).json(reservationDetailContact);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    }
    async getAllReservationDetailContact (req: Request, res: Response) {
        try {
            const reservationDetailContact = await ReservationDetailContactService.getAllReservationDetailContact();
            res.status(200).json(reservationDetailContact);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    }
}
export default new ReservationDetailContactController();