export interface DishType {
    _id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    categories: string[];
    countInStock: number;
    rating: number;
    favorites: number;
  }
  