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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dayjs_1 = __importDefault(require("dayjs"));
const customParseFormat_1 = __importDefault(require("dayjs/plugin/customParseFormat"));
dayjs_1.default.extend(customParseFormat_1.default);
class UserService {
    constructor() {
        this.getAllUser = (_a) => __awaiter(this, [_a], void 0, function* ({ page = 1, limit = 10, keyword = '' }) {
            const query = {};
            if (keyword) {
                query.$or = [
                    { username: { $regex: keyword, $options: 'i' } },
                    { email: { $regex: keyword, $options: 'i' } },
                ];
            }
            const skip = (page - 1) * limit;
            try {
                const [docs, totalDocs] = yield Promise.all([
                    UserModel_1.default.find(query).skip(skip).limit(limit),
                    UserModel_1.default.countDocuments(query),
                ]);
                const totalPages = Math.ceil(totalDocs / limit);
                return {
                    docs,
                    totalDocs,
                    totalPages,
                    page,
                    limit,
                };
            }
            catch (error) {
                console.error('Error in getAllUser:', error.message);
                throw new Error('Failed to fetch users');
            }
        });
    }
    getAllUserByUserRole() {
        return __awaiter(this, arguments, void 0, function* (page = 1, pageSize = 10) {
            try {
                // const allUserByUserRole = await User.find();
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
                // const filteredUsers = allUserByUserRole.filter(
                //   (user) => user.roles && user.roles.length > 0,
                // );
                return {
                    status: 'OK',
                    message: 'getAllUserByUserRole success',
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
                console.error('Error fetching users with role user:', error);
                throw new Error('Failed to fetch users with role user');
            }
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
                    return {
                        status: 'ERROR',
                        message: 'Invalid User ID',
                        data: null,
                    };
                }
                const user = yield UserModel_1.default.findById(userId)
                    .populate({
                    path: 'roles',
                    select: 'name description',
                })
                    .select('-password');
                if (!user) {
                    return {
                        status: 'ERROR',
                        message: 'User not found',
                        data: null,
                    };
                }
                return {
                    status: 'OK',
                    message: 'User details retrieved successfully',
                    data: user,
                };
            }
            catch (error) {
                console.error('Error fetching user details:', error);
                throw new Error('Failed to fetch user details');
            }
        });
    }
    blockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
                    return {
                        status: 'ERROR',
                        message: 'Invalid User ID',
                        data: null,
                    };
                }
                const user = yield UserModel_1.default.findById(userId);
                if (!user) {
                    return {
                        status: 'ERROR',
                        message: 'User not found',
                        data: null,
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
                    status: 'OK',
                    message: `User ${user.status} successfully`,
                    data: user,
                };
            }
            catch (error) {
                console.error('Error blocking user:', error);
                return {
                    status: 'ERROR',
                    message: 'Failed to block user',
                    data: null,
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
                const userRole = yield RoleModel_1.default.findOne({ name: 'user' });
                if (!userRole) {
                    throw new Error('Role user not found');
                }
                query.roles = userRole._id;
                const sort = {};
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
                    UserModel_1.default.find(query).select('-password').sort(sort).skip(skip).limit(limit),
                    UserModel_1.default.countDocuments(query),
                ]);
                return {
                    status: 'SUCCESS',
                    data: {
                        users,
                        metadata: {
                            total: totalDocuments,
                            page: page,
                            pageSize: limit,
                            totalPages: Math.ceil(totalDocuments / limit),
                        },
                    },
                };
            }
            catch (error) {
                throw new Error(`Error filtering users: ${error.message}`);
            }
        });
    }
    updateUserInfo(userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (updateData.birthday && typeof updateData.birthday === 'string') {
                    const parsed = (0, dayjs_1.default)(updateData.birthday, ['DD-MM-YYYY', 'YYYY-MM-DD'], true);
                    if (!parsed.isValid()) {
                        throw new Error(`Invalid birthday format: ${updateData.birthday}`);
                    }
                    updateData.birthday = parsed.toDate();
                }
                const user = yield UserModel_1.default.findByIdAndUpdate(userId, { $set: updateData }, { new: true }).select('-password');
                if (!user) {
                    return {
                        status: 'ERROR',
                        message: 'User not found',
                    };
                }
                return {
                    status: 'OK',
                    message: 'User updated successfully',
                    data: user,
                };
            }
            catch (error) {
                throw new Error('Failed to update user info: ' + error.message);
            }
        });
    }
    changeUserPassword(userId, currentPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield UserModel_1.default.findById(userId);
                if (!user || !user.password) {
                    return {
                        status: 'ERROR',
                        message: 'User not found or no password set',
                    };
                }
                const isMatch = yield bcryptjs_1.default.compare(currentPassword, user.password);
                if (!isMatch) {
                    return {
                        status: 'ERROR',
                        message: 'Current password is incorrect',
                    };
                }
                const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
                user.password = hashedPassword;
                yield user.save();
                return {
                    status: 'OK',
                    message: 'Password updated successfully',
                };
            }
            catch (error) {
                throw new Error('Failed to change password: ' + error.message);
            }
        });
    }
    addUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, password, phone, birthday, gender, isEmailVerified = false, status = 'inactive', roles = [], } = userData;
                // Kiểm tra input cơ bản
                if (!username || !email || !password) {
                    return {
                        status: 'ERROR',
                        message: 'Vui lòng nhập đầy đủ username, email và password',
                    };
                }
                // Kiểm tra username hoặc email đã tồn tại
                const existingEmail = yield UserModel_1.default.findOne({ email });
                if (existingEmail) {
                    return {
                        status: 'ERROR',
                        message: 'Email đã tồn tại',
                    };
                }
                const existingUsername = yield UserModel_1.default.findOne({ username });
                if (existingUsername) {
                    return {
                        status: 'ERROR',
                        message: 'Username đã tồn tại',
                    };
                }
                // Băm mật khẩu
                const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
                // Resolve roles
                const resolvedRoles = yield RoleModel_1.default.find({ _id: { $in: roles } });
                // Tạo người dùng mới
                const newUser = new UserModel_1.default({
                    username,
                    email,
                    password: hashedPassword,
                    phone,
                    birthday,
                    gender,
                    isEmailVerified,
                    status,
                    roles: resolvedRoles.map((r) => r._id),
                });
                const savedUser = yield newUser.save();
                return {
                    status: 'OK',
                    message: 'Tạo người dùng thành công',
                    data: savedUser,
                };
            }
            catch (error) {
                console.error('Error creating user:', error);
                return {
                    status: 'ERROR',
                    message: 'Không thể tạo người dùng',
                };
            }
        });
    }
}
exports.default = new UserService();
