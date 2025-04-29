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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const RoleModel_1 = __importDefault(require("../models/RoleModel"));
class AuthMiddleWare {
    verifyToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authHeader = req.headers['authorization'];
                const token = typeof authHeader === 'string' ? authHeader.split(' ')[1] : null;
                if (!token) {
                    return res.status(401).json({ message: 'Access token not provided' });
                }
                jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
                    if (err) {
                        console.error('Token verification failed:', err);
                        return res.status(403).json({ message: 'Invalid or expired token' });
                    }
                    req.user = user;
                    next();
                });
            }
            catch (error) {
                return res.status(500).json({ message: 'Token middleware error', error: error.message });
            }
        });
    }
    verifyRefreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.refreshToken;
                if (!token)
                    return res.status(401).json({ message: 'Refresh token not found' });
                jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN, (err, user) => {
                    if (err)
                        return res
                            .status(403)
                            .json({ message: 'Invalid or expired refresh token' });
                    req.user = user;
                    next();
                });
            }
            catch (error) {
                return res
                    .status(500)
                    .json({ message: 'Internal server error', error: error.message });
            }
        });
    }
    verifyRole(roles) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'User not authenticated' });
                    return;
                }
                const user = req.user;
                if (!user.roles || user.roles.length === 0) {
                    res.status(401).json({ message: 'User role not found' });
                    return;
                }
                const userRoles = yield RoleModel_1.default.find({
                    _id: { $in: user.roles },
                }).lean();
                if (!userRoles || userRoles.length === 0) {
                    res.status(401).json({ message: 'No valid roles found' });
                    return;
                }
                const roleNames = userRoles.map((role) => role.name);
                const hasRole = roles.some((role) => roleNames.includes(role));
                if (hasRole) {
                    return next();
                }
                else {
                    res
                        .status(403)
                        .json({ message: 'Permission denied: Insufficient role' });
                    return;
                }
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: 'Internal server error', error: error.message });
                return;
            }
        });
    }
}
exports.default = new AuthMiddleWare();
