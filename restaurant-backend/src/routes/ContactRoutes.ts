import { Router } from 'express';
import ContactController from '../controller/ContactController';
import AuthMiddleWare from '../middleware/AuthMiddleWare';


const router = Router();

router.post('/contact', ContactController.postContact);

export default router;