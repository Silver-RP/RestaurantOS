import { useEffect, useState } from 'react';
import { FoodResponse } from '../types/Dish.types';
import { fetchFoodBySearch } from '../api/FoodApi';


export const useFoodsSearch = (query: string, page: number, limit: number) => {
    const [foods, setFoods] = useState<FoodResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetchFoodBySearch({ search: query, page, limit });

                setFoods(res);
            } catch (err) {
                setError('Lỗi khi tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [query, page, limit]);

    return { foods, loading, error };
};

