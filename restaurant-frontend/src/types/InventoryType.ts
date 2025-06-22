export type InventoryTransaction = {
    _id: string;
    transaction_type: 'import' | 'export' | 'adjustment';
    quantity: number;
    transaction_date: string;
    notes?: string;
    ingredient: { _id: string; name: string; unit: string };
    user: { _id: string; name: string; email: string };
    adjustment_batch?: {
        _id: string;
        reason: string;
        adjustment_date: string;
        daily_batch_id: string;
    };
};

export type InventoryTransactionResponse = {
    docs: InventoryTransaction[];
    totalDocs: number;
    limit: number;
    currentPage: number;
    totalPages: number;
    page: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
}


export type InventoryTransactionFilterParams = {
    page?: number;
    limit?: number;
    sort?: string;
    search?: string;
    from?: string;
    to?: string;
    transaction_type?: string;
    user_id?: string;
    ingredient_id?: string;
};

export type SortField =
  | 'transaction_type'
  | 'transaction_date'
  | 'ingredient_name'
  | 'units'
  | 'quantity'
  | 'user_name'
  | null;

