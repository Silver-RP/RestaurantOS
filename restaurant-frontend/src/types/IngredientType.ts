export type Ingredient = {
    _id: string;
    name: string;
    group: string;
    subGroup: string;
    currentStock: number;
    slug: string;
    price_per_unit: number;
    lowStockThreshold: number;
    unit: string;
    isDeleted: boolean;
    deletedAt?: Date | null;   
    createdAt: Date;
    updatedAt: Date;
};

export type IngredientResponse = {
    docs: Ingredient[];
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

export type IngredientFormData = {
    name: string;
    price: number;
    unit: string;
    image?: File | null;
};

export type IngredientFilterParams = {
    page?: number;
    limit?: number;
    maxPrice?: number;
    minPrice?: number;
    unit?: string;
    group?: string;
    stockStatus?: string;
    search?: string;
    sort?: string;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
    isDeleted?: boolean;
};

export type IngredientOption = {
    id: string;
    name: string;
    unit: string;
    currentStock: number;
}
