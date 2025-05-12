export interface AddToCartResponse {
  success: boolean;
  message: string;
  cartItems: any[];
}

export interface CartItem {
  _id: string;
  userId: string;
  items: {
    dishId: {
      _id: string;
      name: string;
      price: number;
      discount_price?: number;
      imageUrl: string;
      hoverImage?: string;
    };
    quantity: number;
    price: number;
    note: string | null;
  }[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}
