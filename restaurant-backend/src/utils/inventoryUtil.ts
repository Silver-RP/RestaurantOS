import { InventoryTransaction } from '../models/InventoryTransactionModel';
import { InventoryDaily } from '../importData/inventoryModelSample/InventoryDailyModel';
import mongoose from 'mongoose';
import dayjs from 'dayjs';
import { IInventoryDailyBatch, InventoryDailyBatch } from '../models/InventoryDailyBatchModel';
import IngredientModel from '../models/IngredientModel';
import { InventoryAdjustmentBatch } from '../models/InventoryAdjustmentBatchModel';


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

// createInventoryBatch function

export async function formatItems(items: any[], type: string) {
    return items.map((item) => {
        const { ingredient_id, quantity, note, initial_quantity } = item;

        if (!ingredient_id || quantity == null || quantity < 0) {
            throw new Error('Thiếu hoặc sai thông tin nguyên liệu!');
        }

        const adjustedQuantity = type === 'export' ? -Math.abs(quantity) : quantity;

        return {
            ingredient_id: new mongoose.Types.ObjectId(ingredient_id),
            initial_quantity: initial_quantity ?? 0,
            quantity: adjustedQuantity,
            notes: note?.trim() || '',
        };
    });
}

export async function checkExistingBatch(batch_date: Date, type: string) {
    const existing = await InventoryDailyBatch.exists({ batch_date, type });
    if (existing) throw new Error(`Đã tồn tại batch ${type} ngày hôm nay!`);
}

export async function  checkStockBeforeExport(formattedItems: any[], batch_date: Date) {
    for (const item of formattedItems) {
        const ingredient = await IngredientModel.findById(item.ingredient_id);
        if (!ingredient) continue;

        const currentStock = await getCurrentStock(item.ingredient_id, batch_date);
        const afterExport = currentStock + item.quantity;

        console.log(`Kiểm tra xuất kho: ${ingredient.name} hiện còn ${currentStock}, sau khi xuất còn ${afterExport}`);

        if (afterExport < 0) {
            console.warn(`⚠️ Xuất vượt tồn kho! ${ingredient.name} hiện còn ${currentStock}, sau khi xuất còn ${afterExport}`);
        }
    }
}

export async function getCurrentStock(ingredientId: mongoose.Types.ObjectId, batch_date: Date) {
    const todayStock = await IngredientModel.aggregate([
        { $match: { _id: ingredientId } },
        {
            $lookup: {
                from: 'inventorydailybatches',
                let: { ingredientId: '$_id' },
                pipeline: [
                    { $match: { $expr: { $lte: ['$batch_date', batch_date] } } },
                    { $unwind: '$items' },
                    { $match: { $expr: { $eq: ['$items.ingredient_id', '$$ingredientId'] } } },
                    { $group: { _id: null, total: { $sum: '$items.quantity' } } },
                ],
                as: 'stock',
            },
        },
        { $addFields: { currentStock: { $ifNull: [{ $arrayElemAt: ['$stock.total', 0] }, 0] } } },
    ]);

    return todayStock[0]?.currentStock ?? 0;
}

export async function setInitialQuantities(formattedItems: any[], batch_date: Date) {
    for (const item of formattedItems) {
        item.initial_quantity = await getCurrentStock(item.ingredient_id, batch_date);
    }
}

export async function createBatch(formattedItems: any[], batch_date: Date, userId: string, type: string) {
    return await InventoryDailyBatch.create({
        batch_date,
        type,
        user_id: new mongoose.Types.ObjectId(userId),
        items: formattedItems,
    });
}

export async function handleAuditAdjustments(formattedItems: any[],  items: any[], batch: IInventoryDailyBatch, batch_date: Date, userId: string) {
    const adjustmentItems = formattedItems
        .filter(item => item.quantity !== item.initial_quantity)
        .map(item => ({
            ingredient_id: item.ingredient_id,
            estimated_quantity: item.initial_quantity ?? 0,
            actual_quantity: item.quantity,
            difference: item.quantity - (item.initial_quantity ?? 0),
            reason: (items.find(i => i.ingredient_id === item.ingredient_id.toString()) as any)?.reason || 'Không rõ',
            notes: item.notes || '',
        }));

    if (adjustmentItems.length > 0) {
        await InventoryAdjustmentBatch.create({
            adjustment_date: batch_date,
            user_id: new mongoose.Types.ObjectId(userId),
            daily_batch_id: batch._id,
            items: adjustmentItems,
        });

        await InventoryDailyBatch.deleteMany({
            type: 'adjustment',
            batch_date,
            'items.ingredient_id': { $in: adjustmentItems.map(i => i.ingredient_id) }
        });

        console.log("adjustmentItems: ", adjustmentItems);

        await InventoryDailyBatch.create({
            batch_date,
            type: 'adjustment',
            user_id: new mongoose.Types.ObjectId(userId),
            items: adjustmentItems.map(item => ({
                ingredient_id: item.ingredient_id,
                quantity: item.difference,
                reason: item.reason,
                notes: item.notes
            }))
        });
    }
}