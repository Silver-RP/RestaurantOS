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
class StaffService {
    getAllStaff(page, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userRole = yield RoleModel_1.default.findOne({ name: "user" });
                if (!userRole) {
                    return {
                        status: "Error",
                        message: "Role 'user' not found"
                    };
                }
                const query = { roles: { $ne: userRole._id } };
                console.log("query", query);
                const options = {
                    page,
                    limit: pageSize,
                    select: "-password -otp -otpExpiry -googleId -facebookId -roles -default_address_id -isEmailVerifided -exprireAt -isVerified",
                    sort: { createdAt: -1 },
                    populate: {
                        path: 'roles',
                        select: 'name',
                    },
                };
                const allStaff = yield UserModel_1.default.paginate(query, options);
                console.log("allStaff", allStaff);
                return {
                    status: "SUCCESS",
                    data: allStaff.docs,
                    metadata: {
                        total: allStaff.totalDocs,
                        page: allStaff.page,
                        pageSize: allStaff.limit,
                        totalPages: allStaff.totalPages
                    }
                };
            }
            catch (error) {
                throw new Error(`Error fetching staff: ${error.message}`);
            }
        });
    }
    createStaff(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let roleIds = [];
                if (data.roles && Array.isArray(data.roles) && data.roles.length > 0) {
                    const validRoles = yield RoleModel_1.default.find({ name: { $in: data.roles } });
                    if (validRoles.length === 0) {
                        throw new Error("Invalid roles provided");
                    }
                    roleIds = validRoles.map((role) => role._id);
                }
                else {
                    const defaultRole = yield RoleModel_1.default.findOne({ name: "staff" });
                    if (!defaultRole) {
                        throw new Error("Default role 'Staff' not found");
                    }
                    roleIds = [defaultRole._id];
                }
                const newStaff = new UserModel_1.default({
                    userName: data.userName || null,
                    email: data.email || null,
                    password: data.password || null,
                    birthday: data.birthday || null,
                    avatar: data.avatar || null,
                    phone: data.phone || null,
                    Active_code: data.Active_code || null,
                    googleId: data.googleId || null,
                    facebookId: data.facebookId || null,
                    otp: data.otp || null,
                    otpExpiry: data.otpExpiry || null,
                    roles: roleIds,
                    gender: data.gender || null,
                    status: data.status || null,
                    default_address_id: data.default_address_id || null,
                    isEmailVerifided: data.isEmailVerifided || false,
                    expireAt: data.expireAt || null,
                    isVerified: data.isVerified || false,
                });
                yield newStaff.save();
                return {
                    status: "SUCCESS",
                    message: "Staff created successfully",
                    data: newStaff,
                };
            }
            catch (error) {
                return {
                    status: "ERROR",
                    message: `Error creating staff: ${error.message}`,
                };
            }
        });
    }
    updateStaff(staffId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingStaff = yield UserModel_1.default.findById(staffId);
                if (!existingStaff) {
                    throw new Error("Staff not found");
                }
                if (data.roles && Array.isArray(data.roles) && data.roles.length > 0) {
                    const validRoles = yield RoleModel_1.default.find({ name: { $in: data.roles } });
                    if (validRoles.length === 0) {
                        throw new Error("Invalid roles provided");
                    }
                    data.roles = validRoles.map((role) => role._id);
                }
                Object.keys(data).forEach((key) => {
                    const field = key;
                    if (data[field] !== undefined && data[field] !== null) {
                        existingStaff[field] = data[field];
                    }
                });
                // Lưu thay đổi
                yield existingStaff.save();
                return {
                    status: "SUCCESS",
                    message: "Staff updated successfully",
                    data: existingStaff,
                };
            }
            catch (error) {
                return {
                    status: "ERROR",
                    message: `Error updating staff: ${error.message}`,
                };
            }
        });
    }
    deleteStaff(staffId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingStaff = yield UserModel_1.default.findById(staffId);
                if (!existingStaff) {
                    throw new Error("Staff not found");
                }
                yield existingStaff.deleteOne();
                return {
                    status: "SUCCESS",
                    message: "Staff deleted successfully",
                };
            }
            catch (error) {
                return {
                    status: "ERROR",
                    message: `Error deleting staff: ${error.message}`,
                };
            }
        });
    }
    filterStaff(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = {};
                const userRole = yield RoleModel_1.default.findOne({ name: "user" });
                if (!userRole) {
                    throw new Error("Role 'user' not found");
                }
                query.roles = { $ne: userRole._id };
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
                const [staff, totalDocuments] = yield Promise.all([
                    UserModel_1.default.find(query)
                        .select('-password')
                        .sort(sort)
                        .skip(skip)
                        .limit(limit),
                    UserModel_1.default.countDocuments(query),
                ]);
                return {
                    status: "SUCCESS",
                    data: {
                        staff,
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
                throw new Error(`Error filtering staff: ${error.message}`);
            }
        });
    }
}
exports.default = new StaffService();
