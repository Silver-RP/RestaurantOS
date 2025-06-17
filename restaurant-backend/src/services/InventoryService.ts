import { InventoryTransaction } from "../models/InventoryTransactionModel";
import { InventoryDaily } from "../importData/inventoryModelSample/InventoryDailyModel";
import IngredientModel, { IIngredient } from "../models/IngredientModel";
import { InventoryDailyBatch, IInventoryDailyBatch } from "../models/InventoryDailyBatchModel";
import { InventoryAdjustmentBatch } from "../models/InventoryAdjustmentBatchModel";
import {
    buildMatchCriteria,
    addLookupStages,
    addSearchStage,
    addSortStage,
    addPaginationStage,
    addProjectionStage,
    getCountAndData,
    buildResponse,
    createTransaction,
    updateInventoryDaily,
    checkExistingBatch,
    checkStockBeforeExport,
    formatItems,
    setInitialQuantities,
    createBatch,
    handleAuditAdjustments,
    createInventoryTransactions

} from "../utils/inventoryUtil";
import mongoose from "mongoose";
import dayjs from "dayjs";
import { GetTransactionQuery, GetInventoryDailyQuery } from "../types/inventoryTypes";

class InventoryService {

    async getInventoryTransactions(query: GetTransactionQuery): Promise<any> {
        const {
            search,
            ingredient_id,
            user_id,
            type,
            from,
            to,
            page = 1,
            limit = 20,
            sort = 'transaction_date:desc',
        } = query;

        const pipeline: any[] = [];
        addLookupStages(pipeline); // JOIN ingredient and user

        // FILTERS
        const match = buildMatchCriteria({ ingredient_id, user_id, type, from, to });
        if (Object.keys(match).length > 0) {
            pipeline.push({ $match: match });
        }

        if (search) { addSearchStage(pipeline, search) }
        addSortStage(pipeline, sort);
        addPaginationStage(pipeline, page, limit);

        const projectionForInventoryTransaction = {
            _id: 1,
            transaction_type: 1,
            quantity: 1,
            transaction_date: 1,
            notes: 1,
            createdAt: 1,
            updatedAt: 1,
            ingredient: {
                _id: '$ingredient._id',
                name: '$ingredient.name',
                unit: '$ingredient.unit',
            },
            user: {
                _id: '$user._id',
                name: '$user.name',
                email: '$user.email',
            },
            adjustment_id: 1,
        }; // Consider projection to only retrieve necessary fields and add relevant fields related to Adjustment

        addProjectionStage(pipeline, projectionForInventoryTransaction);// project only necessary fields

        const [data, total] = await getCountAndData(InventoryTransaction, pipeline);// get data and total count

        return buildResponse(data, page, limit, total);
    }

    async createInventoryBatch(
        type: 'import' | 'export' | 'audit' | 'adjustment',
        items: {
            ingredient_id: string;
            quantity: number;
            unit?: string;
            note?: string;
            initial_quantity?: number;
        }[],
        userId: string
    ): Promise<IInventoryDailyBatch> {
    
        if (!items?.length) {
            throw new Error('Danh sách nguyên liệu không hợp lệ!');
        }
    
        const batch_date = dayjs().startOf('day').toDate();
        const formattedItems = await formatItems(items, type);
        
        await checkExistingBatch(batch_date, type);
        
        if (type === 'export') {
            await checkStockBeforeExport(await formattedItems, batch_date);
        } else if (type === 'audit') {
            await setInitialQuantities(await formattedItems, batch_date);
        }
    
        const batch = await createBatch(await formattedItems, batch_date, userId, type);
        if (type !== 'audit') {
            await createInventoryTransactions({ type, items: formattedItems, batch_date, userId });
        }
        
        if (type === 'audit') {
            await handleAuditAdjustments(await formattedItems, items, batch, batch_date, userId);
        }

        return batch;
    }
    
    
    



















    async createInventoryTransaction(data: any, userId: string) {
        const {
            transaction_type,
            quantity,
            transaction_date,
            ingredient_id,
            notes,
            adjustment_id,
        } = data;

        const dateOnly = dayjs(transaction_date).startOf('day').toDate();

        const newTransaction = await createTransaction({
            transaction_type,
            quantity,
            transaction_date,
            ingredient_id,
            userId,
            notes,
            adjustment_id,
        });

        await updateInventoryDaily(transaction_type, quantity, ingredient_id, dateOnly, userId);

        return newTransaction;
    }

    async getInventoryTransactionById(id: string): Promise<any> {
        const transaction = await InventoryTransaction.findById(id)
            .populate('ingredient_id', 'name unit')
            .populate('user_id', 'name email')
            .populate('adjustment_id', 'reason createdAt')
            .lean();
        if (!transaction) {
            throw new Error('Transaction not found');
        }
        return transaction;
    }

    async getInventoryDaily(query: GetInventoryDailyQuery) {
        const {
            search,
            page = 1,
            limit = 20,
            sort = 'inventory_date:desc',
        } = query;

        const pipeline: any[] = [];

        addLookupStages(pipeline);

        const match = buildMatchCriteria(query, 'inventory_date', false);
        if (Object.keys(match).length > 0) {
            pipeline.push({ $match: match });
        }

        if (search) {
            addSearchStage(pipeline, search);
        }

        addSortStage(pipeline, sort);
        addPaginationStage(pipeline, page, limit);

        const projectionForInventoryDaily = {
            _id: 1,
            inventory_date: 1,
            ingredient: {
                _id: '$ingredient._id',
                name: '$ingredient.name',
                unit: '$ingredient.unit',
            },
            total_import_quantity: 1,
            total_export_quantity: 1,
            total_adjustment_quantity: 1,
            current_quantity: 1,
            createdAt: 1,
            updatedAt: 1,
        };


        addProjectionStage(pipeline, projectionForInventoryDaily);

        const [data, total] = await getCountAndData(InventoryDaily, pipeline);

        return buildResponse(data, page, limit, total);
    }

    async getInventoryDailyById(id: string): Promise<any> {
        const daily = await InventoryDaily.findById(id)
            .populate('ingredient_id', 'name unit')
            .populate('user_id', 'name email')
            .lean();

        if (!daily) {
            throw new Error('Inventory daily not found');
        }

        return daily;
    }


}

export default new InventoryService();