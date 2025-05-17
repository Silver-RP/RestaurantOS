import { Category } from "./Category.type";

export interface FoodType {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  categories: string[];
  countInStock: number;
  rating: number;
  favorites_count: number;
}

export interface FoodDetail {
  _id: string;
  name: string;
  slug: string;
  categories: Category[];
  status: 'hidden' | 'available' | 'soldout';
  price: number;
  discount_price?: number;
  discountUntil?: Date;
  isDishNew?: boolean;
  newUntil?: Date;
  description: string;
  shortDescription?: string;
  ingredients?: string;
  images: string[];
  countInStock: number;
  views: number;
  ordered_count: number;
  favorites_count: number;
  average_rating: number;
  rating_count: number;
  rating: number;
  alcohol_type?: string;
  origin?: string;
  alcohol_content?: number;
  volume?: number;
  createdAt: string;
}


export interface FoodResponse {
  docs: FoodDetail[];
  totalDocs: number;
  limit: number;
  currentPage: number;
  totalPages: number;
  page: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}
export interface FavoriteItem {
  _id: string;
  userId: string;
  dishId: {
    _id: string;
    name: string;
    price: number;
    discount_price?: number;
    images: string[];
    categories?: {
      _id: string;
      Cate_name: string;
    }[];
  };
}