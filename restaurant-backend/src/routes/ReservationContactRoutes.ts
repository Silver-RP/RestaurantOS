import { Router } from 'express';
import ReservationContactController from '../controller/ReservationContactController';
const router = Router();
router.post('/create', ReservationContactController.createReservationContact);
router.get('/getall', ReservationContactController.getAllReservationContact);
router.get('/getbyid/:id', ReservationContactController.getReservationById);
router.put(
  '/update/:id',
  ReservationContactController.updateReservationContact,
);
router.delete(
  '/delete/:id',
  ReservationContactController.deleteReservationContact,
);
export default router;
