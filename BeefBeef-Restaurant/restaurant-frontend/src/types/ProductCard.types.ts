import { Category } from "./Category.type";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;        
  isRecommend?: boolean;
  hoverImage?: string;      
  price: number;          
  originalPrice?: number;   
  discount?: string;        
  description: string;      
  cate?: string;             
  isDishNew?: boolean;
  views?: number;
  ordered_count?: number;
  favorites_count?: number;
  rating?: number;
  rating_count?: number;
  createdAt?: string;
  categories?: Category[];
  onAddToFavorite: () => void; 
  status?: 'hidden' | 'available' | 'soldout';
}