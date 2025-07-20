export interface IFaq {
  id: string;
  question: string;
  answer: string;
  category?: string;
  is_active?: boolean;
  updated_at?: string;
  created_at?: string;
}
