import { Request, Response } from 'express';
import InventoryService from '../services/InventoryService';
import { IUser } from '../models/UserModel';
import { Types } from 'mongoose';
import mongoose from 'mongoose';

class InventoryController{

    async getInventoryTransantion(req: Request, res: Response): Promise<any> {
        const query = req.query;
        const resultTransaction = await InventoryService.getInventoryTransactions(query);
        if (resultTransaction) {
            return res.status(200).json({
                status: 'success',
                message: 'Inventory transactions retrieved successfully',
                data: resultTransaction.data,
                totalCount: resultTransaction.pagination.total
            });
        } else {
            return res.status(404).json({ message: 'No inventory transactions found' });
        }
    }

    async createInventoryTransantion(req: Request, res: Response): Promise<any>{
        const data = req.body;
        const userId = (req.user as IUser ).id as Types.ObjectId; 
        const transaction = await InventoryService.createInventoryTransaction(data, userId.toString());
        if (transaction !== undefined) {
            return res.status(201).json({
                status: 'success',
                message: 'Inventory transaction created successfully',
                data: transaction
            });
        } else {
            return res.status(400).json({ message: 'Failed to create inventory transaction' });
        }
    }

    async getInventoryTransactionById(req: Request, res: Response): Promise<any>{
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid transaction ID' });
          }
      
        const transaction = await InventoryService.getInventoryTransactionById(id);
        if (transaction) {
            return res.status(200).json({
                status: 'success',
                message: 'Inventory transaction retrieved successfully',
                data: transaction
            });
        } else {
            return res.status(404).json({ message: 'Inventory transaction not found' });
        }
    }

    async getInventoryDaily(req: Request, res: Response): Promise<any> {
        const query = req.query;
        const resultDaily = await InventoryService.getInventoryDaily(query);
        if (resultDaily) {
            return res.status(200).json({
                status: 'success',
                message: 'Inventory daily records retrieved successfully',
                data: resultDaily.data,
                totalCount: resultDaily.pagination.total
            });
        } else {
            return res.status(404).json({ message: 'No inventory daily records found' });
        }
    }

    async getInventoryDailyById(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid daily record ID' });
        }

        const daily = await InventoryService.getInventoryDailyById(id);
        if (daily) {
            return res.status(200).json({
                status: 'success',
                message: 'Inventory daily record retrieved successfully',
                data: daily
            });
        } else {
            return res.status(404).json({ message: 'Inventory daily record not found' });
        }
    }

    async updateTransaction(req: Request, res: Response): Promise<any> {

    }

    async deleteInventoryTransaction(req: Request, res: Response): Promise<any> {

    }
}

export default new InventoryController();