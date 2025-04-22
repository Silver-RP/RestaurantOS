export interface Category {
    _id: string;
    Cate_name: string;
    Cate_slug: string;
    Cate_type: string;
    Cate_img: string | null;
    parentCate: string | null;
  }