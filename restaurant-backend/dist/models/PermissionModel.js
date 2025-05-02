'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const mongoose_1 = __importDefault(require('mongoose'));
const PermissionSchema = new mongoose_1.default.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  roles: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Roles' }],
});
const PermissionsModel = mongoose_1.default.model(
  'Permissions',
  PermissionSchema,
); // Sửa tên mô hình thành 'Permissions'
exports.default = PermissionsModel;
