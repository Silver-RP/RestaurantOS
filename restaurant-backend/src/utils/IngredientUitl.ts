import Ingredient from '../models/IngredientModel';


export function buildMatchQuery(filters: {
    search?: string;
    isDeleted: boolean;
    unit?: string;
    group?: string;
    minPrice?: number;
    maxPrice?: number;
}) {
    const { search, isDeleted, unit, group, minPrice, maxPrice } = filters;

    const match: any = { isDeleted };

    if (search) {
        match.name = { $regex: search, $options: 'i' };
    }
    if (unit) {
        match.unit = unit;
    }
    if (group) {
        match.group = group;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        match.price_per_unit = {};
        if (minPrice !== undefined) match.price_per_unit.$gte = minPrice;
        if (maxPrice !== undefined) match.price_per_unit.$lte = maxPrice;
    }

    return match;
}

export function buildSortStage(sort: string): Record<string, number> {
    const sortMap: Record<string, any> = {
        nameAZ: { name: 1 },
        nameZA: { name: -1 },
        groupAZ: { group: 1 },
        groupZA: { group: -1 },
        unitAZ: { unit: 1 },
        unitZA: { unit: -1 },
        priceLow: { price_per_unit: 1 },
        priceHigh: { price_per_unit: -1 },
        currentLow: { currentStock: 1 },
        currentHigh: { currentStock: -1 },
    };

    return sortMap[sort] || { createdAt: -1 };
}

export function getTodayUTC(): Date {
    const today = new Date();
    return new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
}

export function buildIngredientAggregate({
    match,
    sortStage,
    page,
    limit,
    todayUtc,
}: {
    match: any;
    sortStage: any;
    page: number;
    limit: number;
    todayUtc: Date;
}) {
    return Ingredient.aggregate([
        { $match: match },
        {
            $lookup: {
                from: 'inventorydailybatches',
                let: { ingredientId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $lte: ['$batch_date', todayUtc],
                            },
                        },
                    },
                    { $unwind: '$items' },
                    {
                        $match: {
                            $expr: {
                                $eq: ['$items.ingredient_id', '$$ingredientId'],
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalQuantity: { $sum: '$items.quantity' },
                        },
                    },
                ],
                as: 'dailyStock',
            },
        },
        {
            $addFields: {
                currentStock: {
                    $ifNull: [{ $arrayElemAt: ['$dailyStock.totalQuantity', 0] }, 0],
                },
            },
        },
        { $sort: sortStage },
        { $skip: (page - 1) * limit },
        { $limit: limit },
    ]);
}
