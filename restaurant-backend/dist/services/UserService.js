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
const mongoose_1 = __importDefault(require("mongoose"));
const RoleModel_1 = __importDefault(require("../models/RoleModel"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
class UserService {
    getAllUser() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allUser = yield UserModel_1.default.find({});
                return {
                    status: "OK",
                    message: "getAllUser success",
                    data: allUser
                };
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    getAllUserByUserRole() {
        return __awaiter(this, arguments, void 0, function* (page = 1, pageSize = 10) {
            try {
                const allUserByUserRole = yield UserModel_1.default.find();
                const options = {
                    page,
                    limit: pageSize,
                    populate: {
                        path: 'roles',
                        match: { name: 'user' },
                        select: 'name description',
                    },
                    select: '-password',
                };
                const result = yield UserModel_1.default.paginate({}, options);
                const filteredUsers = allUserByUserRole.filter((user) => user.roles && user.roles.length > 0);
                return {
                    status: "OK",
                    message: "getAllUserByUserRole success",
                    data: result.docs,
                    pagination: {
                        total: result.totalDocs,
                        page: result.page,
                        pageSize: result.limit,
                        totalPages: result.totalPages,
                    },
                };
            }
            catch (error) {
                console.error("Error fetching users with role user:", error);
                throw new Error("Failed to fetch users with role user");
            }
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
                    return {
                        status: "ERROR",
                        message: "Invalid User ID",
                        data: null
                    };
                }
                const user = yield UserModel_1.default.findById(userId)
                    .populate({
                    path: 'roles',
                    select: 'name description'
                })
                    .select('-password');
                if (!user) {
                    return {
                        status: "ERROR",
                        message: "User not found",
                        data: null
                    };
                }
                return {
                    status: "OK",
                    message: "User details retrieved successfully",
                    data: user
                };
            }
            catch (error) {
                console.error("Error fetching user details:", error);
                throw new Error("Failed to fetch user details");
            }
        });
    }
    blockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
                    return {
                        status: "ERROR",
                        message: "Invalid User ID",
                        data: null
                    };
                }
                const user = yield UserModel_1.default.findById(userId);
                if (!user) {
                    return {
                        status: "ERROR",
                        message: "User not found",
                        data: null
                    };
                }
                if (user.status === 'blocked') {
                    user.status = 'active';
                }
                else {
                    user.status = 'blocked';
                }
                yield user.save();
                return {
                    status: "OK",
                    message: `User ${user.status} successfully`,
                    data: user
                };
            }
            catch (error) {
                console.error("Error blocking user:", error);
                return {
                    status: "ERROR",
                    message: "Failed to block user",
                    data: null
                };
            }
        });
    }
    filterUsers(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = {};
                if (options.gender) {
                    query.gender = options.gender;
                }
                if (options.status) {
                    query.status = options.status;
                }
                if (options.startDate || options.endDate) {
                    query.exprireAt = {};
                    if (options.startDate) {
                        query.exprireAt.$gte = options.startDate;
                    }
                    if (options.endDate) {
                        query.exprireAt.$lte = options.endDate;
                    }
                }
                const userRole = yield RoleModel_1.default.findOne({ name: "user" });
                if (!userRole) {
                    throw new Error("Role 'user' not found");
                }
                query.roles = userRole._id;
                let sort = {};
                if (options.nameSort) {
                    sort.userName = options.nameSort === 'A->Z' ? 1 : -1;
                }
                if (options.emailSort) {
                    sort.email = options.emailSort === 'A->Z' ? 1 : -1;
                }
                const page = options.page || 1;
                const limit = options.pageSize || 10;
                const skip = (page - 1) * limit;
                const [users, totalDocuments] = yield Promise.all([
                    UserModel_1.default
                        .find(query)
                        .select('-password')
                        .sort(sort)
                        .skip(skip)
                        .limit(limit),
                    UserModel_1.default.countDocuments(query)
                ]);
                return {
                    status: "SUCCESS",
                    data: {
                        users,
                        metadata: {
                            total: totalDocuments,
                            page: page,
                            pageSize: limit,
                            totalPages: Math.ceil(totalDocuments / limit)
                        }
                    }
                };
            }
            catch (error) {
                throw new Error(`Error filtering users: ${error.message}`);
            }
        });
    }
}
exports.default = new UserService();
