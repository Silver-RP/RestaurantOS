import { Router} from "express";
import UserController from "../controller/UserController"; 
import AuthMiddleWare from "../middleware/AuthMiddleWare";
const router = Router(); 

router.get("/getAllUser", AuthMiddleWare.verifyToken,  UserController.getAllUser); 
router.get("/getAllUserByUserRole", UserController.getAllUserByUserRole);
router.get("/getUserById/:userId", UserController.getUserById);
router.post("/blockUser/:userId", UserController.blockUser);

router.get("/filterUser", async (req, res) => {
    try {
        await UserController.filterUser(req, res); 
    } catch (error) {
        res.status(500).json({ message: "Error filtering users" });
    }
});





export default router; 