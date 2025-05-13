import { useEffect } from 'react';
import { countFoodView } from '../api/FoodApi';

export function useProductView(productId: string) {
    useEffect(() => {
        const STORAGE_KEY = 'productViews';
        const views = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        const lastViewedAt = views[productId];
        const now = new Date();
        const TEN_MINUTES = 10 * 60 * 1000;

        if (!lastViewedAt || new Date(lastViewedAt).getTime() + TEN_MINUTES < now.getTime()) {
            countFoodView(productId)
                .then(() => {
                    console.log(`Product ${productId} view counted.`);
                });

            views[productId] = now.toISOString();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(views));
        }
    }, [productId]);
}
