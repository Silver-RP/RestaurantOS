export interface Category {
    _id: string;
    Cate_name: string;
    Cate_slug: string;
    Cate_type: string;
    Cate_img: string | null;
    parentCate: string | null;
  }

// Đại diện cho response khi fetch all categories
export interface CategoryResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: Category[];
}