import ReservationContact from '../services/ReservationContactService';
import { Request, Response } from 'express';
class ReservationContactController {
  // API giúp bên admin có thể tạo các loại bàn mới
  async createReservationContact(req: Request, res: Response) {
    try {
      const { tableType, activeHours, tableCount, location } = req.body;
      // Gọi phương thức createReservationContact từ đối tượng này
      const reservationcontact = await ReservationContact.createReservationContact(req.body);

      res.status(200).json(reservationcontact);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllReservationContact(req: Request, res: Response) {
    try {
      // Gọi phương thức getAllReservationContact từ đối tượng này
      const reservationcontact = await ReservationContact.getAllReservationContact();
      res.status(200).json(reservationcontact);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getReservationById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const reservationcontact = await ReservationContact.getReservationContactById(id);
      res.status(200).json(reservationcontact);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateReservationContact(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { tableType, activeHours, tableCount, location } = req.body;
      const reservationcontact = await ReservationContact.updateReservationContact(id, req.body);
      res.status(200).json(reservationcontact);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteReservationContact(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const reservationcontact = await ReservationContact.deleteReservationCotact(id);
      res.status(200).json(reservationcontact);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
export default new ReservationContactController();
