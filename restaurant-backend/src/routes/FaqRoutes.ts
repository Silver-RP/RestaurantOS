import { Router } from 'express';
import FaqController from '../controller/FaqController';
const router = Router();
router.get('/getall', FaqController.getAllFaqs);
router.post('/create', FaqController.createFaq);
export default router;
