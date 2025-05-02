import { Router } from 'express';
import ReservationDetailContactController from '../controller/ReservationDetailContactController';
const router = Router();
router.post(
  '/create',
  ReservationDetailContactController.createReservationDetailContact,
);
router.get(
  '/getall',
  ReservationDetailContactController.getAllReservationDetailContact,
);
router.get(
  '/getbyid/:id',
  ReservationDetailContactController.getReservationDetailContactById,
);
router.put(
  '/update/:id',
  ReservationDetailContactController.updateReservationDetailContact,
);
router.delete(
  '/delete/:id',
  ReservationDetailContactController.deleteReservationDetailContact,
);
export default router;
