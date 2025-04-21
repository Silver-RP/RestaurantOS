export interface ProductCardProps {
  name: string;
  imageUrl: string;
  hoverImage?: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  isNew?: boolean;
  description: string;
  cate?: string;
}