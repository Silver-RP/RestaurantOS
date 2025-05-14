export interface Category {
    foodCount: number;
    _id: string;
    Cate_name: string;
    Cate_slug: string;
    Cate_type: 'dish' | 'drink'; 
    Cate_img: string | null;
    parentCate: string | null;
  }

export interface CategoryResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: Category[];
}
export interface CategoryCreatePayload {
  Cate_name: string;
  Cate_slug: string;
  Cate_type: 'dish' | 'drink'; 
  Cate_img?: File;
  parentCate?: string;
  message?: string | null;
  error?: string | null;
  loading?: boolean;
}