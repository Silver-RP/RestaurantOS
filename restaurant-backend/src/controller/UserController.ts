import UserService from "../services/UserService"; 
import { Request, Response } from "express"; 
class UserController {
    async getAllUser(req: Request, res: Response){
        try {
            const getAllUser = await UserService.getAllUser(); 
            res.status(200).json(getAllUser);
        } catch (error: any) {
            throw new Error(error);             
        }
    }
}
export default new UserController(); 