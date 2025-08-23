import axiosInstance from './axiosInstance';
import { IFaq } from '../types/Faq.type'; 

export const getAllFaqs = async () => {
  const res = await axiosInstance.get(`/faq/getall`);
  console.log('getAllFaqs response:', res.data);
  return res.data;
};

export const getAnswerByQuestion = async (question: string): Promise<IFaq | null> => {
  try {
    const faqs: IFaq[] = await getAllFaqs();

    return faqs.find((faq: IFaq) => faq.question.trim().toLowerCase() === question.trim().toLowerCase()) || null;
    
  } catch (error) {
    console.error('Không tìm thấy câu trả lời:', error);
    return null;
  }
  }
