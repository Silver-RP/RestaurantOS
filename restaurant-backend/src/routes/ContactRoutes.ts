import { Router } from 'express';
import ContactController from '../controller/ContactController';
import AuthMiddleWare from '../middleware/AuthMiddleWare';


const router = Router();

router.post('/createContact', AuthMiddleWare.optionalVerifyToken, ContactController.postContact);
router.get('/getAllContact', AuthMiddleWare.verifyToken, ContactController.getAllContact)
router.patch('/updateStatus/:id', AuthMiddleWare.verifyToken, ContactController.updateContactStatus)

export default router;