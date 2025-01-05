import { Router } from "express"; 
import ReservationDetailContactController from "../controller/ReservationDetailContactController";
const router = Router(); 
router.post("/create", ReservationDetailContactController.createReservationDetailContact);
router.get("/getall", ReservationDetailContactController.getAllReservationDetailContact);
router.get("/getbyid/:id", );
router.put("/update/:id", );
router.delete("/delete/:id", );
export default router;