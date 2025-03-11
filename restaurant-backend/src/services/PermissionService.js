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
const PermissionModel_1 = __importDefault(require("../models/PermissionModel"));
class PermissionService {
    GetALlPermission() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const permissions = yield PermissionModel_1.default.find();
                return permissions.length > 0 ? permissions : null;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    AddPermission(name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingPermission = yield PermissionModel_1.default.findOne({ name });
                if (existingPermission) {
                    throw new Error("Permission already exists!");
                }
                const newPermission = new PermissionModel_1.default({ name, description });
                yield newPermission.save();
                return newPermission;
            }
            catch (error) {
            }
        });
    }
    GetPermissionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const permission = yield PermissionModel_1.default.findById(id);
                return permission;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    UpdatePermission(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const permission = yield PermissionModel_1.default.findById(id);
                if (!permission) {
                    throw new Error("Permission not found!");
                }
                if (data.name) {
                    permission.name = data.name;
                }
                if (data.description) {
                    permission.description = data.description;
                }
                yield permission.save();
                return permission;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    DeletePermission(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const permission = yield PermissionModel_1.default.findByIdAndDelete(id);
                return permission;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.default = new PermissionService();
