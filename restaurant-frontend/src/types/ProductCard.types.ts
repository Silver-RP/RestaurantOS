import { Category } from "./Category.type";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;        
  hoverImage?: string;      
  price: number;          
  originalPrice?: number;   
  discount?: string;        
  description: string;      
  cate?: string;             
  isNew?: boolean;
  views?: number;
  ordered_count?: number;
  rating?: number;
  rating_count?: number;
  createdAt?: string;
  categories?: Category[];
}