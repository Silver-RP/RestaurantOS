import { Router } from 'express';
import RoleController from '../controller/RoleController';
import AuthMiddleWare from '../middleware/AuthMiddleWare';

const router = Router();

router.post(
  '/addrole',
  AuthMiddleWare.verifyToken,
  AuthMiddleWare.verifyRole(['superadmin']),
  RoleController.AddRole,
);

router.get(
  '/getrolebyid/:id',
  AuthMiddleWare.verifyToken,
  AuthMiddleWare.verifyRole(['superadmin']),
  RoleController.GetRoleById,
);

router.get(
  '/getallrole',
  AuthMiddleWare.verifyToken,
  AuthMiddleWare.verifyRole(['superadmin']),
  RoleController.GetAllRole,
);

router.put(
  '/updaterole/:id',
  AuthMiddleWare.verifyToken,
  AuthMiddleWare.verifyRole(['superadmin']),
  RoleController.UpdateRole,
);

router.delete(
  '/deleterole/:id',
  AuthMiddleWare.verifyToken,
  AuthMiddleWare.verifyRole(['superadmin']),
  RoleController.DeleteRole,
);

export default router;
