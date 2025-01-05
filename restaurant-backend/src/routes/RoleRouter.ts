import {Router} from "express";
import RoleController from "../controller/RoleController";
import AuthMiddleWare from "../middleware/AuthMiddleWare";

const router = Router();

router.post('/addrole', 
    AuthMiddleWare.verifyToken,   
    AuthMiddleWare.verifyRole(["superadmin"]),  
    RoleController.AddRole 
);

router.get('/getrolebyid/:id', RoleController.GetRoleById);

router.get('/getallrole', RoleController.GetAllRole);

router.put('/updaterole/:id', RoleController.UpdateRole);

router.delete('/deleterole/:id', RoleController.DeleteRole);

export default router;