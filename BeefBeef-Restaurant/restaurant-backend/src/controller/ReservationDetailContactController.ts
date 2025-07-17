import ReservationDetailContactService from '../services/ReservationDetailContactService';
import { Request, Response } from 'express';

class ReservationDetailContactController {
  async createReservationDetailContact(req: Request, res: Response) {
    try {
      const { reservation, reservationDate, guestCount, timeReservation, status, user, notes } =
        req.body;
      const reservationDetailContact =
        await ReservationDetailContactService.createReservationDetailContact(req.body);
      res.status(200).json(reservationDetailContact);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllReservationDetailContact(req: Request, res: Response) {
    try {
      const reservationDetailContact =
        await ReservationDetailContactService.getAllReservationDetailContact();
      res.status(200).json(reservationDetailContact);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getReservationDetailContactById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const reservationDetailContact =
        await ReservationDetailContactService.getReservationDetailContactById(id);
      res.status(200).json(reservationDetailContact);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateReservationDetailContact(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const reservationDetailContact =
        await ReservationDetailContactService.updateReservationDetailContact(id, req.body);
      res.status(200).json(reservationDetailContact);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteReservationDetailContact(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const reservationDetailContact =
        await ReservationDetailContactService.deleteReservationDetailContact(id);
      res.status(200).json(reservationDetailContact);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
export default new ReservationDetailContactController();
