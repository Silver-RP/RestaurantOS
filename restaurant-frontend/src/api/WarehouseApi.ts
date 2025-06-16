import api from './axiosInstance';
import { IngredientResponse, IngredientFilterParams } from '@/types/IngredientType';

export const warehouseImportIngredientsApi = async (
    data: {
        ingredients: {
            ingredient_id: string;
            quantity: number;
            unit: string;
            note: string;
        }[];
    },
): Promise<void> => {
    try {
        console.log('Importing ingredients:', data);
        const res = await api.post('/inventory/inventory-daily', data);
        return res.data;
    } catch (error) {
        console.error('Error importing ingredients:', error);
        throw error;
    }
}

export const warehouseExportIngredientApi = async (
    data: {
        ingredientId: string;
        quantity: number;
        note?: string;
    },
): Promise<void> => {
    try {
        const res = await api.post('/warehouse/export-ingredients', data);
        return res.data;
    } catch (error) {
        console.error('Error exporting ingredient:', error);
        throw error;
    }
}

export const warehouseAuditApi = async (
    data: {
        ingredients: {
            ingredientId: string;
            quantity: number;
            note?: string;
        }[];
    },
): Promise<void> => {
    try {
        const res = await api.post('/warehouse/audit-ingredients', data);
        return res.data;
    } catch (error) {
        console.error('Error auditing ingredients:', error);
        throw error;
    }
}

export const getWarehouseTransactionsApi = async (
    params: IngredientFilterParams,
): Promise<{ data: any[]; total: number }> => {
    try {
        const res = await api.get('/warehouse/get-transactions', { params });
        return res.data;
    } catch (error) {
        console.error('Error fetching warehouse transactions:', error);
        throw error;
    }
}