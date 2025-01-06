import { Router} from "express";
import AuthMiddleWare from "../middleware/AuthMiddleWare";
import StaffController from "../controller/StaffController";
const router = Router(); 

router.get("/getAllStaff", async (req, res)=> {
    try{
        await StaffController.getAllStaff(req, res);
    }catch(error){  
        res.status(500).json({message: "Error fetching staff"});
    }

});

router.post("/createStaff", StaffController.createStaff);

export default router;
