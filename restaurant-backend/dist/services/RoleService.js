"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RoleModel_1 = __importDefault(require("../models/RoleModel"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
const PermissionModel_1 = __importDefault(require("../models/PermissionModel"));
const mongoose_1 = __importDefault(require("mongoose"));
class RoleService {
    GetAllRole() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roles = yield RoleModel_1.default.find().populate('permissions').populate({
                    path: 'users',
                    model: UserModel_1.default,
                });
                return roles.length > 0 ? roles : null;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    AddRole(name, description, permission) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingRole = yield RoleModel_1.default.findOne({ name });
                if (existingRole) {
                    throw new Error('Role already exists!');
                }
                // Chuyển các permission id từ chuỗi thành ObjectId hợp lệ
                const permissionIds = permission.map((id) => new mongoose_1.default.Types.ObjectId(id));
                console.log('permiss', permissionIds);
                // Kiểm tra xem các permission đã tồn tại chưa
                const permissions = yield PermissionModel_1.default.find({
                    _id: { $in: permissionIds },
                });
                if (permissions.length !== permission.length) {
                    throw new Error('Invalid permission id');
                }
                // Tạo mới role với mảng permissionIds thay vì chuỗi
                const newRole = new RoleModel_1.default({
                    name,
                    description,
                    permissions: permissionIds,
                });
                yield newRole.save();
                return newRole;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    GetRoleById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const role = yield RoleModel_1.default.findById(id)
                    .populate({ path: 'permissions', model: PermissionModel_1.default })
                    .populate({
                    path: 'users',
                    model: UserModel_1.default,
                });
                return role;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    UpdateRole(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Nếu có thay đổi quyền, kiểm tra lại
                if (data.permission && Array.isArray(data.permission)) {
                    const permissions = yield PermissionModel_1.default.find({
                        _id: { $in: data.permission },
                    });
                    if (permissions.length !== data.permission.length) {
                        throw new Error('Some permissions do not exist!');
                    }
                }
                // Cập nhật role với các thay đổi
                const updatedRole = yield RoleModel_1.default.findByIdAndUpdate(id, data, {
                    new: true,
                    runValidators: true,
                });
                return updatedRole;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    DeleteRole(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedRole = yield RoleModel_1.default.findByIdAndDelete(id);
                return !!deletedRole;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.default = new RoleService();
