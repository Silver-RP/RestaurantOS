import FaqService from '../services/FaqService';
import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { createFaqSchema } from '../validators/faqValidator';

class FaqController {
  async getAllFaqs(req: Request, res: Response): Promise<void> {
    try {
      const faqs = await FaqService.getAllFaqs();
      res.status(200).json(faqs);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: `Error fetching FAQs: ${error.message}` });
      } else {
        res.status(500).json({ message: 'Error fetching FAQs: Unknown error' });
      }
    }
  }
  async createFaq(req: Request, res: Response): Promise<void> {
    try {
      const parsed = createFaqSchema.parse(req.body);

      const newFaq = await FaqService.createFaq({
        question: parsed.question,
        answer: parsed.answer,
        category: parsed.category,
      });

      res.status(201).json({
        message: 'FAQ đã được tạo thành công.',
        data: newFaq,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: 'Dữ liệu không hợp lệ',
          errors: error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
        return;
      }
      const errMsg = (error as Error).message;
      if (errMsg.includes('tồn tại')) {
        res.status(409).json({ message: errMsg });
      } else {
        console.error('Error creating FAQ:', error);
        res.status(500).json({ message: 'Lỗi hệ thống khi tạo FAQ.' });
      }
    }
  }
}
export default new FaqController();
