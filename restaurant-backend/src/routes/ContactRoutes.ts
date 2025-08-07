import { Router } from 'express';
import ContactController from '../controller/ContactController';
import AuthMiddleWare from '../middleware/AuthMiddleWare';


const router = Router();

router.post('/createContact', AuthMiddleWare.optionalVerifyToken, ContactController.postContact);

export default router;