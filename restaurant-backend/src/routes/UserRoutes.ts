import { Router} from "express";
import UserController from "../controller/UserController"; 
import AuthMiddleWare from "../middleware/AuthMiddleWare";
const router = Router(); 
router.get("/getAllUser",AuthMiddleWare.verifyToken,  UserController.getAllUser); 
export default router; 