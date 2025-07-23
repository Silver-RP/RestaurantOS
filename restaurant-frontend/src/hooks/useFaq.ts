
import { getAllFaqs } from '@/api/FaqApi';
import { IFaq } from '@/types/Faq.type';
import { useEffect, useState } from 'react';

export const useFaq = () => {
  const [faqs, setFaqs] = useState<IFaq[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const data = await getAllFaqs();
      console.log(data);
      setFaqs(data);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải FAQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  return { faqs, loading, error };
};
