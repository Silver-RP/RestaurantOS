import rateLimit from 'express-rate-limit';

export const addressSearchLimiter = rateLimit({
  windowMs: 60 * 2000,
  max: 20,
  message: {
    error: 'Bạn đang gửi quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
