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
const RefreshToken_1 = __importDefault(require("../models/RefreshToken"));
class AuthMiddleWare {
    verifyToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authHeader = req.headers['authorization'];
                const token = authHeader && typeof authHeader === 'string' ? authHeader.split(' ')[1] : null;
                if (!token) {
                    res.status(401).json({ message: 'Access token not provided' });
                    return;
                }
                const user = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN);
                req.user = user;
                next();
            }
            catch (err) {
                console.error('Token verification failed:', err.message);
                res.status(403).json({ message: 'Invalid or expired token' });
                return;
            }
        });
    }
    verifyRefreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.refreshToken;
                if (!token) {
                    return res.status(401).json({ message: 'Refresh token not found' });
                }
                const decoded = jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN);
                const storedToken = yield RefreshToken_1.default.findOne({ token });
                if (!storedToken) {
                    return res.status(403).json({ message: 'Refresh token not found in database' });
                }
                if (storedToken.isRevoked) {
                    return res.status(403).json({ message: 'Refresh token has been revoked' });
                }
                const requestIP = req.ip;
                const requestUA = req.get('User-Agent');
                if (storedToken.ipAddress !== requestIP || storedToken.userAgent !== requestUA) {
                    return res.status(403).json({ message: 'New device detected. Verification required.' });
                }
                req.user = {
                    _id: decoded.id,
                    roles: decoded.roles,
                };
                req.refreshToken = storedToken;
                next();
            }
            catch (err) {
                console.error('Error in verifyRefreshToken:', err);
                return res.status(403).json({ message: 'Invalid or expired refresh token' });
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
                const userRoles = yield RoleModel_1.default.find({ _id: { $in: user.roles } }).lean();
                const roleNames = userRoles.map((role) => role.name);
                const hasRole = roles.some((role) => roleNames.includes(role));
                if (hasRole) {
                    next();
                }
                else {
                    res.status(403).json({ message: 'Permission denied: Insufficient role' });
                }
            }
            catch (err) {
                res.status(500).json({ message: 'Internal server error', error: err.message });
            }
        });
    }
}
exports.default = new AuthMiddleWare();
