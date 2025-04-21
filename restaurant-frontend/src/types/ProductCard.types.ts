export interface ProductCardProps {
  id: string;
  name: string;
  imageUrl: string;        
  hoverImage?: string;      
  price: number;          
  originalPrice?: number;   
  discount?: string;        
  description: string;      
  cate?: string;             
  isNew?: boolean;         
}