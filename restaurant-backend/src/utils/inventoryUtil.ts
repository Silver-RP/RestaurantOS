import { InventoryTransaction } from '../models/InventoryTransactionModel';
import { InventoryDaily } from '../models/InventoryDailyModel';
import mongoose from 'mongoose';
import dayjs from 'dayjs';


// Get all Inventory Transactions/Dailies Service

export function addLookupStages(pipeline: any[]) {
    pipeline.push(
        {
            $lookup: {
                from: 'ingredients',
                localField: 'ingredient_id',
                foreignField: '_id',
                as: 'ingredient',
            },
        },
        { $unwind: '$ingredient' },
        {
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user',
            },
        },
        { $unwind: '$user' }
    );
}

export function buildMatchCriteria(
    { ingredient_id, user_id, type, from, to }: any,
    dateFieldName: string = 'transaction_date',
    allowTypeFilter = true
) {
    const match: any = {};

    if (ingredient_id && mongoose.Types.ObjectId.isValid(ingredient_id)) {
        match['ingredient_id'] = new mongoose.Types.ObjectId(ingredient_id);
    }
    if (user_id && mongoose.Types.ObjectId.isValid(user_id)) {
        match['user_id'] = new mongoose.Types.ObjectId(user_id);
    }
    if (type && allowTypeFilter) {
        match['transaction_type'] = type;
    }
    if (from || to) {
        match[dateFieldName] = {};
        if (from) match[dateFieldName].$gte = dayjs(from).startOf('day').toDate();
        if (to) match[dateFieldName].$lte = dayjs(to).endOf('day').toDate();
    }

    return match;
}

export function addSearchStage(pipeline: any[], search: string) {
    const regex = new RegExp(search, 'i');
    pipeline.push({
        $match: {
            $or: [
                { notes: regex },
                { 'ingredient.name': regex },
                { 'user.name': regex },
            ],
        },
    });
}

export function addSortStage(pipeline: any[], sort: string) {
    const [sortField, sortDirection] = sort.split(':');
    pipeline.push({
        $sort: {
            [sortField]: sortDirection === 'asc' ? 1 : -1,
        },
    });
}

export function addPaginationStage(pipeline: any[], page: number, limit: number) {
    const skip = (page - 1) * limit;
    pipeline.push(
        { $skip: skip },
        { $limit: limit }
    );
}

export function addProjectionStage(pipeline: any[], projection: Record<string, any>) {
    pipeline.push({ $project: projection });
}

export async function getCountAndData(model: mongoose.Model<any>, pipeline: any[]) {
    const countPipeline = pipeline.slice(0, pipeline.findIndex(p => '$project' in p));
    countPipeline.push({ $count: 'total' });

    const [data, countResult] = await Promise.all([
        model.aggregate(pipeline),
        model.aggregate(countPipeline),
    ]);

    const total = countResult[0]?.total || 0;
    return [data, total];
}

export function buildResponse(data: any[], page: number, limit: number, total: number) {
    return {
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

// Create Inventory Transaction + Daily Service

export async function calculateInitialQuantityBeforeDate(ingredientId: string, date: Date): Promise<number> {
    const result = await InventoryTransaction.aggregate([
        {
            $match: {
                ingredient_id: ingredientId,
                transaction_date: { $lt: date },
            },
        },
        {
            $group: {
                _id: null,
                total: {
                    $sum: {
                        $cond: [
                            { $in: ['$transaction_type', ['import', 'adjustment']] }, '$quantity',
                            { $multiply: ['$quantity', -1] },
                        ]
                    }
                },
            },
        },
    ]);

    return result.length > 0 ? result[0].total : 0;
}

export async function createTransaction(transactionData: any) {
    return InventoryTransaction.create({
        ...transactionData,
        user_id: transactionData.userId,
        adjustment_id: transactionData.adjustment_id || null,
    });
}

export async function updateInventoryDaily(transaction_type: string, quantity: number, ingredient_id: string, dateOnly: Date, userId: string) {
    const daily = await InventoryDaily.findOne({ ingredient_id, inventory_date: dateOnly });

    const { imported_quantity, exported_quantity } = calculateQuantities(transaction_type, quantity);

    if (daily) {
        await updateExistingDaily(daily, imported_quantity, exported_quantity);
    } else {
        await createNewDaily(ingredient_id, dateOnly, userId, imported_quantity, exported_quantity);
    }
}

export function calculateQuantities(transaction_type: string, quantity: number) {
    return {
        imported_quantity: transaction_type === 'import' ? quantity : 0,
        exported_quantity: transaction_type === 'export' ? quantity : 0,
    };
}

export async function updateExistingDaily(daily: any, imported_quantity: number, exported_quantity: number) {
    daily.imported_quantity += imported_quantity;
    daily.exported_quantity += exported_quantity;
    daily.actual_remaining_quantity = daily.initial_quantity + daily.imported_quantity - daily.exported_quantity;
    await daily.save();
}

export async function createNewDaily(ingredient_id: string, dateOnly: Date, userId: string, imported_quantity: number, exported_quantity: number) {
    const initial_quantity = await calculateInitialQuantityBeforeDate(ingredient_id, dateOnly);
    const actual_remaining_quantity = initial_quantity + imported_quantity - exported_quantity;

    await InventoryDaily.create({
        inventory_date: dateOnly,
        ingredient_id,
        user_id: userId,
        initial_quantity,
        imported_quantity,
        exported_quantity,
        actual_remaining_quantity,
    });
}