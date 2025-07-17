export interface CategoryType {
  _id: string;
  Cate_name: string;
  Cate_slug: string;
  Cate_img: string;
  Cate_type: string;
}

export interface UserType {
  _id: string;
  username: string;
  email: string;
  avatar: string;
}

export interface PostType {
  _id: string;
  title: string;
  slug: string;
  desc: string;
  content: string;
  images: string[];
  categories_id: CategoryType;
  user_id: UserType;
  views?: number;
  likes?: number;
  likedBy?: string[];
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published';
  tags?: string[];
  scheduledAt?: string; // Add scheduledAt field
}

export interface PostFormData {
  title: string;
  desc: string;
  content: string;
  images?: File[];
  status?: 'draft' | 'published';  
  categories_id: string;
}
