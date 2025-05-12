'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const mongoose_1 = __importDefault(require('mongoose'));
const PermissionModel_1 = __importDefault(require('./PermissionModel')); // Đảm bảo import đúng model Permissions
const RoleSchema = new mongoose_1.default.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  permissions: [
    {
      type: mongoose_1.default.Schema.Types.ObjectId,
      ref: PermissionModel_1.default,
    },
  ],
  users: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
});
const Roles = mongoose_1.default.model('Roles', RoleSchema);
exports.default = Roles;
