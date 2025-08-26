import { Router } from 'express';
import { ReservationController } from '../controller/ReservationController';
import AuthMiddleWare from '../middleware/AuthMiddleWare';

const router = Router();

router.post('/create', ReservationController.create);

router.get('/validate', ReservationController.getReservationByCodeAndPhoneNumber);

router.get('/my-reservations', AuthMiddleWare.verifyToken, ReservationController.getMyReservations);

router.get('/:id', ReservationController.getById);

router.get('/', ReservationController.getAll);

router.patch('/:id/status', ReservationController.updateStatus);

router.patch('/:id/cancel', ReservationController.cancel);

router.patch('/:id/restore', ReservationController.restore);

router.patch('/:reservationId/confirm', ReservationController.confirmReservation);

export default router;
