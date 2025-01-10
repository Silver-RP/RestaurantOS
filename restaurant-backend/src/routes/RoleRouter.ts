import {Router} from "express";
import RoleController from "../controller/RoleController";
import AuthMiddleWare from "../middleware/AuthMiddleWare";

const router = Router();

router.post('/addrole',AuthMiddleWare.verifyToken,  RoleController.AddRole);

router.get('/getrolebyid/:id', AuthMiddleWare.verifyToken, RoleController.GetRoleById);

router.get('/getallrole',AuthMiddleWare.verifyToken ,
     RoleController.GetAllRole);

router.put('/updaterole/:id',AuthMiddleWare.verifyToken, RoleController.UpdateRole);

router.delete('/deleterole/:id',AuthMiddleWare.verifyToken, RoleController.DeleteRole);

export default router;