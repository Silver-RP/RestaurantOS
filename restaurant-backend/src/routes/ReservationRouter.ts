import { Router } from 'express';
import { ReservationController } from '../controller/ReservationController';
import AuthMiddleWare from '../middleware/AuthMiddleWare';

const router = Router();

router.post('/create', AuthMiddleWare.optionalVerifyToken, ReservationController.create);

router.get('/validate', AuthMiddleWare.optionalVerifyToken, ReservationController.getReservationByCodeAndPhoneNumber);

router.get('/my-reservations', AuthMiddleWare.verifyToken, ReservationController.getMyReservations);

router.get('/:id',AuthMiddleWare.optionalVerifyToken,  ReservationController.getById);

router.get('/', AuthMiddleWare.optionalVerifyToken, ReservationController.getAll);

router.patch('/:id/status', AuthMiddleWare.optionalVerifyToken, ReservationController.updateStatus);

router.patch('/:id/cancel', AuthMiddleWare.optionalVerifyToken, ReservationController.cancel);

router.patch('/:id/restore', AuthMiddleWare.optionalVerifyToken, ReservationController.restore);

router.patch('/:reservationId/confirm', AuthMiddleWare.optionalVerifyToken, ReservationController.confirmReservation);

export default router;
