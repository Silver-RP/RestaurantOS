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
const UserService_1 = __importDefault(require("../services/UserService"));
class UserController {
    getAllUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, keyword = '' } = req.query;
                const result = yield UserService_1.default.getAllUser({
                    page: Number(page),
                    limit: Number(limit),
                    keyword: String(keyword),
                });
                res.status(200).json({
                    status: 'OK',
                    message: 'Fetched users successfully',
                    data: result, // docs, totalDocs, totalPages, page, limit
                });
            }
            catch (error) {
                console.error('Error fetching users:', error.message);
                res.status(500).json({
                    status: 'ERROR',
                    message: 'Failed to fetch users',
                    error: error.message || 'Internal Server Error',
                });
            }
        });
    }
    getAllUserByUserRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getAllUserByUserRole = yield UserService_1.default.getAllUserByUserRole();
                res.status(200).json(getAllUserByUserRole);
            }
            catch (error) {
                console.error('Error fetching users by role:', error.message);
                res.status(500).json({
                    status: 'ERROR',
                    message: 'Failed to fetch users with role user',
                    error: error.message || 'Internal Server Error',
                });
            }
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const getUserById = yield UserService_1.default.getUserById(userId);
                res.status(200).json(getUserById);
            }
            catch (error) {
                console.error('Error fetching user by id:', error.message);
                res.status(500).json({
                    status: 'ERROR',
                    message: 'Failed to fetch user by id',
                    error: error.message || 'Internal Server Error',
                });
            }
        });
    }
    blockUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const blockUser = yield UserService_1.default.blockUser(userId);
                res.status(200).json(blockUser);
            }
            catch (error) {
                console.error('Error blocking user:', error.message);
                res.status(500).json({
                    status: 'ERROR',
                    message: 'Failed to block user',
                    error: error.message || 'Internal Server Error',
                });
            }
        });
    }
    filterUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filterOptions = {
                    nameSort: req.query.nameSort, // 'A->Z', 'Z->A'
                    emailSort: req.query.emailSort, // 'A->Z', 'Z->A'
                    gender: req.query.gender, // 'male', 'female', 'other'
                    status: req.query.status, // 'active', 'inactive', 'blocked'
                    startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
                    endDate: req.query.endDate ? new Date(req.query.endDate) : undefined,
                    page: req.query.page ? parseInt(req.query.page) : 1,
                    pageSize: req.query.pageSize ? parseInt(req.query.pageSize) : 10,
                };
                const result = yield UserService_1.default.filterUsers(filterOptions);
                return res.status(200).json(result);
            }
            catch (error) {
                return res.status(500).json({
                    status: 'ERROR',
                    message: error.message,
                });
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const updateData = req.body;
                const result = yield UserService_1.default.updateUserInfo(userId, updateData);
                res.status(200).json(result); // ❌ không return
            }
            catch (error) {
                res.status(500).json({
                    status: 'ERROR',
                    message: error.message,
                });
            }
        });
    }
    changeUserPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const { currentPassword, newPassword } = req.body;
                const result = yield UserService_1.default.changeUserPassword(userId, currentPassword, newPassword);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({
                    status: 'ERROR',
                    message: error.message,
                });
            }
        });
    }
    addUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                const result = yield UserService_1.default.addUser(userData);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({
                    status: 'ERROR',
                    message: error.message,
                });
            }
        });
    }
}
exports.default = new UserController();
