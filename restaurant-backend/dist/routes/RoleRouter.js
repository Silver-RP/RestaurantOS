'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = require('express');
const RoleController_1 = __importDefault(
  require('../controller/RoleController'),
);
const AuthMiddleWare_1 = __importDefault(
  require('../middleware/AuthMiddleWare'),
);
const router = (0, express_1.Router)();
router.post(
  '/addrole',
  AuthMiddleWare_1.default.verifyToken,
  AuthMiddleWare_1.default.verifyRole(['superadmin']),
  RoleController_1.default.AddRole,
);
router.get(
  '/getrolebyid/:id',
  AuthMiddleWare_1.default.verifyToken,
  AuthMiddleWare_1.default.verifyRole(['superadmin']),
  RoleController_1.default.GetRoleById,
);
router.get(
  '/getallrole',
  AuthMiddleWare_1.default.verifyToken,
  AuthMiddleWare_1.default.verifyRole(['superadmin']),
  RoleController_1.default.GetAllRole,
);
router.put(
  '/updaterole/:id',
  AuthMiddleWare_1.default.verifyToken,
  AuthMiddleWare_1.default.verifyRole(['superadmin']),
  RoleController_1.default.UpdateRole,
);
router.delete(
  '/deleterole/:id',
  AuthMiddleWare_1.default.verifyToken,
  AuthMiddleWare_1.default.verifyRole(['superadmin']),
  RoleController_1.default.DeleteRole,
);
exports.default = router;
