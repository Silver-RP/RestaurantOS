import StaffService from "../services/StaffService"; 
import { Request, Response } from "express";

class StaffController {

    async getAllStaff(req: Request, res: Response){
        try {
            const page = req.query.page? parseInt(req.query.page as string ): 1;
            const pageSize = req.query.pageSize? parseInt(req.query.pageSize as string ): 10;
            const allStaff = await StaffService.getAllStaff(page, pageSize);
            return res.status(200).json(allStaff);
        }catch(error: any){
            return res.status(500).json({
                status: "Error", 
                message: error.message
            });
        }
    }

    async createStaff(req: Request, res: Response){
        try {
            const staff = await StaffService.createStaff(req.body);
            return res.status(201).json(staff);
        }catch(error: any){
            return res.status(500).json({
                status: "Error", 
                message: error.message
            });
        }
    }
}

export default new StaffController();