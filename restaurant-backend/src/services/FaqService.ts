import FAQModel, { IFAQ } from '../models/FaqModel';
class FaqService {
  async getAllFaqs() {
    try {
      const faqs = await FAQModel.find({ is_active: true }).sort({ updated_at: -1 }).exec();
      return faqs;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error fetching FAQs: ${error.message}`);
      } else {
        throw new Error('Error fetching FAQs: Unknown error');
      }
    }
  }
  async createFaq(data: { question: string; answer: string; category?: string }): Promise<IFAQ> {
    const normalizedQuestion = data.question.trim().toLowerCase();

    const exists = await FAQModel.findOne({
      normalized_question: normalizedQuestion,
    });

    if (exists) {
      throw new Error('Câu hỏi này đã tồn tại.');
    }

    const faq = new FAQModel({
      question: data.question.trim(),
      answer: data.answer.trim(),
      category: data.category?.trim() || '',
      is_active: true,
      normalized_question: normalizedQuestion,
    });

    return await faq.save();
  }
}
export default new FaqService();
