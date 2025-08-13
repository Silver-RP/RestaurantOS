// src/routes/authFaceRouter.ts
import { Router } from 'express';
import multer from 'multer';
import { registerFace, verifyFace } from '../controller/AuthFaceController';
const upload = multer();
const router = Router();
router.post('/register_face', upload.single('image'), registerFace);
router.post('/verify_face', upload.single('image'), verifyFace);

export default router;