import {useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DishType } from "types/Dish.types";
const backendUrl = import.meta.env.VITE_BACKEND_URL; 
export const UseDish = (cateType: DishType) => {
    return useQuery({
        queryKey: ["dish", cateType],
        queryFn: async () => {
            const { data } = await axios.get(
                `${backendUrl}/api/food/getFoodByCategory?Cate_type=${cateType}`
            );
            return data;
        },
        refetchOnWindowFocus: false,
    })
}