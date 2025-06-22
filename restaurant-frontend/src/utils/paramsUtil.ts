import { InventoryTransactionFilterParams } from '@/types/InventoryType';

export const warehouseParseFiltersFromSearchParams = (params: URLSearchParams): InventoryTransactionFilterParams => {
    const getNumber = (key: string) => {
        const val = params.get(key);
        return val ? Number(val) : undefined;
    };

    return {
        page: getNumber('page') || 1,
        limit: getNumber('limit') || 12,
        sort: params.get('sort') || 'default',
        search: params.get('keyword') || undefined,
        transaction_type: params.get('transactionType') || undefined,
        ingredient_id: params.get('ingredientId') || undefined,
        from: params.get('dateFrom') || undefined,
        to: params.get('dateTo') || undefined,
        user_id: params.get('userId') || undefined,
    };
};