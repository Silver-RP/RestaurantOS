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
    price: number;
    discount_price?: number;
    description: string;
    shortDescription?: string;
    ingredientsl?: string;
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