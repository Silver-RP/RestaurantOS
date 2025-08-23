import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|webp|mp3|wav|m4a|ogg/;
  const isValidExt = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const isValidMime = allowedTypes.test(file.mimetype);
  if (isValidExt || isValidMime) cb(null, true);
  else cb(new Error('Only image or audio files are allowed!'));
};

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // tăng giới hạn lên 10MB cho audio
});

export default upload;
