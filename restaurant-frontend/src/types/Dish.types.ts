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
  createdAt: string; 
  _id: string;
  name: string;
  category: string;
  slug: string;
  price: number;
  discount_price?: number;
  description: string;
  shortDescription?: string;
  ingredients?: string;
  status: 'hidden' | 'available' | 'soldout';
  views: number;
  ordered_count: number;
  average_rating: number;
  rating_count: number;
  favorites_count: number;
  rating: number;
  categories: Category[];
  countInStock: number;
  images: string[];
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
  name: string;
  price: number;
  discountPrice: string;
  category: string;
  images: string[];
  quantity: number;
}