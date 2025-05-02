'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = require('express');
const PermissionController_1 = __importDefault(
  require('../controller/PermissionController'),
);
const AuthMiddleWare_1 = __importDefault(
  require('../middleware/AuthMiddleWare'),
);
const router = (0, express_1.Router)();
router.get(
  '/getall',
  AuthMiddleWare_1.default.verifyToken,
  AuthMiddleWare_1.default.verifyRole(['superadmin']),
  PermissionController_1.default.GetAllPermission,
);
router.post(
  '/create',
  AuthMiddleWare_1.default.verifyToken,
  AuthMiddleWare_1.default.verifyRole(['superadmin']),
  PermissionController_1.default.AddPermission,
);
router.get(
  '/getbyid/:id',
  AuthMiddleWare_1.default.verifyToken,
  AuthMiddleWare_1.default.verifyRole(['superadmin']),
  PermissionController_1.default.GetPermissionById,
);
router.put(
  '/update/:id',
  AuthMiddleWare_1.default.verifyToken,
  AuthMiddleWare_1.default.verifyRole(['superadmin']),
  PermissionController_1.default.UpdatePermission,
);
router.delete(
  '/delete/:id',
  AuthMiddleWare_1.default.verifyToken,
  AuthMiddleWare_1.default.verifyRole(['superadmin']),
  PermissionController_1.default.DeletePermission,
);
exports.default = router;
