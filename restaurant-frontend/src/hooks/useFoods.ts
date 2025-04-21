import { useState, useEffect } from "react";
import axios from "axios";

export interface FoodItem {
  _id: string;
  name: string;
  images: string[];
  price: number;
  discount_price: number;
  description: string;
  [key: string]: string | number | string[] | undefined;
}

const API_URL = import.meta.env.VITE_BACKEND_URL; 

export const useFoods = () => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get(`${API_URL}/food/getallfood`);
        setFoods(res.data);
      } catch (err) {
        const error = err as Error;
        console.error("Error fetching foods:", error);
        setError(error.message || "Đã xảy ra lỗi.");
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  return { foods, loading, error };
};