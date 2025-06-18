import { InventoryTransaction } from "../models/InventoryTransactionModel";
import { IInventoryDailyBatch } from "../models/InventoryDailyBatchModel";
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
    createInventoryTransactions,
    projectionForInventoryTransaction
} from "../utils/inventoryUtil";
import dayjs from "dayjs";
import { GetTransactionQuery, GetInventoryDailyQuery } from "../types/inventoryTypes";

class InventoryService {

    async getInventoryTransactions(query: GetTransactionQuery): Promise<any> {
        const {
            search,
            ingredient_id,
            user_id,
            transaction_type,
            from,
            to,
        } = query;

        const limit = query.limit !== undefined ? Number(query.limit) : 12;
        const page = query.page !== undefined ? Number(query.page) : 1;
        const sort = query.sort || 'transaction_date:desc';
    
        const basePipeline: any[] = [];
        addLookupStages(basePipeline); // JOIN ingredient and user
    
        const match = buildMatchCriteria({ ingredient_id, user_id, transaction_type, from, to });
        if (Object.keys(match).length > 0) {
            basePipeline.push({ $match: match });
        }
    
        if (search) {
            addSearchStage(basePipeline, search);
        }

        const countPipeline = [...basePipeline, { $count: 'total' }];
    
        addSortStage(basePipeline, sort);
        addPaginationStage(basePipeline, page, limit);
        addProjectionStage(basePipeline, projectionForInventoryTransaction);
    
        const [docs, countResult] = await Promise.all([
            InventoryTransaction.aggregate(basePipeline),
            InventoryTransaction.aggregate(countPipeline),
          ]);
          
        const total = countResult[0]?.total || 0;
        return buildResponse(docs, page, limit, total);
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


}

export default new InventoryService();