import { InventoryTransaction } from "../models/InventoryTransactionModel";
import { IInventoryDaily, InventoryDaily } from "../models/InventoryDailyModel";

class InventoryService{
    async getInventoryTransaction(): Promise<void>{

    }

    async createInventoryTransaction(transaction: IInventoryDaily): Promise<void> {

    }

    async getInventoryTransactionById(id: string): Promise<void> {
        
    }

    async updateInventoryTransaction(id: string, transaction: IInventoryDaily): Promise<void> {
        
    }

    async deleteInventoryTransaction(id: string): Promise<void> {
        
    }

}

export default new InventoryService();