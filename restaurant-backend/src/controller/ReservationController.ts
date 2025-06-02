import { Request, Response } from 'express';
import { IUser } from '../models/UserModel';
import ReservationService from '../services/ReservationService';

export const ReservationController = {
  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as IUser;

      if (!user?.id) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      console.log('📥 Received reservation data:', req.body);
      console.log('👤 User ID:', user.id);

      const reservation = await ReservationService.createReservation(req.body, user.id);

      res.status(201).json({
        success: true,
        message: 'Đặt bàn thành công',
        data: reservation,
      });
    } catch (error: any) {
      console.error('❌ Create reservation error:', error);
      res.status(500).json({
        success: false,
        message: error?.message || 'Đã xảy ra lỗi khi tạo đơn đặt bàn',
      });
    }
  },

  getMyReservations: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req.user as IUser).id?.toString();
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const rawStatus = req.query.status;
      let status: string[] | undefined;

      if (Array.isArray(rawStatus)) {
        status = rawStatus.map((s) => String(s));
      } else if (typeof rawStatus === 'string') {
        status = [rawStatus];
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const result = await ReservationService.getMyReservations(userId, status, page, limit);

      res.json({ success: true, ...result });
    } catch (error) {
      console.error('Get my reservations error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const reservation = await ReservationService.getReservationById(id);
      if (!reservation) {
        res.status(404).json({ message: 'Reservation not found' });
        return;
      }
      res.json({ success: true, data: reservation });
    } catch (error) {
      console.error('Get reservation by id error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getAll: async (_req: Request, res: Response): Promise<void> => {
    try {
      const reservations = await ReservationService.getAllReservations();
      res.json({ success: true, data: reservations });
    } catch (error) {
      console.error('Get all reservations error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  updateStatus: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updated = await ReservationService.updateReservationStatus(id, status);
      res.json({ success: true, data: updated });
    } catch (error) {
      console.error('Update reservation status error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  cancel: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await ReservationService.cancelReservation(id);
      res.json({ success: true, data: result });
    } catch (error) {
      console.error('Cancel reservation error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  restore: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await ReservationService.restoreReservation(id);
      res.json({ success: true, data: result });
    } catch (error) {
      console.error('Restore reservation error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};
