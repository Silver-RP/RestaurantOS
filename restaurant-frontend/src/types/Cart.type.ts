export interface AddToCartResponse {
  success: boolean;
  message: string;
  cartItems: any[];
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  imageUrl: string;
  hoverImage: string;
  discountedPrice: number;
  cate: string;
}
