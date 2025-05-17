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
const AuthService_1 = __importDefault(require("../services/AuthService"));
class AuthController {
    constructor() {
        this.changePasswordProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { oldPassword, newPassword } = req.body;
                const result = yield AuthService_1.default.changePasswordProfile((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, // Lấy từ token
                oldPassword, newPassword);
                console.log('🔐 req.user:', req.user);
                return res.status(200).json({ message: result });
            }
            catch (error) {
                return res.status(400).json({ message: error.message });
            }
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, password } = req.body;
                const user = yield AuthService_1.default.register({
                    username,
                    email,
                    password,
                });
                return res.status(201).json({
                    message: 'User created successfully',
                    user,
                });
            }
            catch (error) {
                console.error('Error during user registration:', error);
                res.status(400).json({ message: error.message });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, rememberMe } = req.body;
                const { token, refresh_token, user, refreshTokenExpiresIn } = yield AuthService_1.default.login({ email, password, rememberMe }, req);
                res.cookie('refreshToken', refresh_token, Object.assign({ httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' }, (rememberMe ? { maxAge: refreshTokenExpiresIn * 1000 } : {})));
                console.log('Login refreshTokenExpiresIn:', refreshTokenExpiresIn);
                res.status(200).json({
                    message: 'User logged in successfully',
                    user,
                    accessToken: token,
                    refreshToken: refresh_token, // for testing
                });
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    refreshAccessToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.cookies;
                const { newAccessToken, newRefreshToken } = yield AuthService_1.default.refreshAccessToken(refreshToken, req);
                res.cookie('accessToken', newAccessToken, {
                    httpOnly: false,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                    maxAge: 60 * 60 * 1000,
                });
                res.cookie('refreshToken', newRefreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                    maxAge: 21 * 24 * 60 * 60 * 1000,
                });
                res.status(200).json({ accessToken: newAccessToken });
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    googleLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const googleUser = req.body.googleUser;
                const rememberMe = req.body.rememberMe;
                if (!googleUser) {
                    return res.status(400).json({ message: 'Google user data is missing' });
                }
                const { email, name, avatar, sub } = googleUser;
                const { user, accessToken, refreshToken, refreshTokenExpiresIn } = yield AuthService_1.default.googleLogin({
                    id: sub,
                    email,
                    googleId: sub,
                    username: name,
                    avatar,
                    rememberMe,
                });
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                    maxAge: refreshTokenExpiresIn * 1000,
                });
                console.log('Google login refreshTokenExpiresIn:', refreshTokenExpiresIn);
                return res.status(200).json({
                    message: 'Google login successful',
                    user,
                    accessToken,
                    refreshToken, // for testing
                });
            }
            catch (error) {
                return res.status(400).json({
                    message: 'Error during Google login',
                    error: error.message,
                });
            }
        });
    }
    googleCallback(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { code } = req.query;
                if (!code) {
                    return res.status(400).json({ message: 'No code provided' });
                }
                const result = yield AuthService_1.default.handleGoogleCallBack(code);
                res.status(200).json({
                    message: 'Google login successful',
                    token: result.accessToken,
                    user: result.user,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    Logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.cookies;
                if (!refreshToken) {
                    return res.status(400).json({ message: 'No refresh token provided' });
                }
                yield AuthService_1.default.logout(refreshToken);
                res.clearCookie('refreshToken', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                });
                res.status(200).json({ message: 'Logout successful' });
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    forgotPasswordHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { phone, email } = req.body;
            if (!phone && !email) {
                return res.status(400).json({ message: 'Vui lòng nhập số điện thoại hoặc email' });
            }
            let identifier = '';
            if (phone && email) {
                return res.status(400).json({
                    message: 'Vui lòng chỉ nhập số điện thoại HOẶC email, không nhập cả hai',
                });
            }
            if (phone) {
                const phoneRegex = /^(?:\+84|0)(3|5|7|8|9)\d{8}$/;
                if (!phoneRegex.test(phone)) {
                    return res.status(400).json({ message: 'Định dạng số điện thoại không hợp lệ' });
                }
                identifier = phone;
            }
            if (email) {
                const emailRegex = /^[a-zA-Z0-9](\.?[a-zA-Z0-9_-])*[a-zA-Z0-9]@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
                if (!emailRegex.test(email)) {
                    return res.status(400).json({ message: 'Định dạng email không hợp lệ' });
                }
                identifier = email;
            }
            try {
                const response = yield AuthService_1.default.sendOtpFlexible(identifier);
                return res.status(200).json({ message: 'OTP sent successfully' });
            }
            catch (error) {
                return res.status(400).json({ message: error.message });
                throw new Error('Gửi OTP qua SMS thất bại, vui lòng thử lại');
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, newPassword, confirmPassword } = req.body;
                if (!email || !newPassword || !confirmPassword) {
                    return res.status(400).json({
                        message: 'Email, new password, and confirm password are required',
                    });
                }
                const emailRegex = /^[a-zA-Z0-9](\.?[a-zA-Z0-9_-])*[a-zA-Z0-9]@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
                if (!emailRegex.test(email)) {
                    return res.status(400).json({ message: 'Invalid email format' });
                }
                if (newPassword !== confirmPassword) {
                    return res.status(400).json({ message: 'Passwords do not match' });
                }
                const result = yield AuthService_1.default.changePasswordByEmail(email, newPassword);
                return res.status(200).json(result); // { message: "..."}
            }
            catch (error) {
                return res.status(400).json({ message: error.message });
            }
        });
    }
    verifyOtpEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                if (!email || !otp) {
                    return res.status(400).json({ message: 'Email and OTP are required' });
                }
                const emailRegex = /^[a-zA-Z0-9](\.?[a-zA-Z0-9_-])*[a-zA-Z0-9]@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
                if (!emailRegex.test(email)) {
                    return res.status(400).json({ message: 'Invalid email format' });
                }
                if (!/^\d{6}$/.test(otp)) {
                    return res.status(400).json({ message: 'OTP must be a 6-digit number' });
                }
                const message = yield AuthService_1.default.verifyForgotPasswordOtp(email, otp);
                return res.status(200).json({ message });
            }
            catch (error) {
                return res.status(400).json({ message: error.message });
            }
        });
    }
    resendVerificationEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                if (email) {
                    const emailRegex = /^[a-zA-Z0-9](\.?[a-zA-Z0-9_-])*[a-zA-Z0-9]@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
                    if (!emailRegex.test(email)) {
                        return res.status(400).json({ message: 'Định dạng email không hợp lệ' });
                    }
                }
                const response = yield AuthService_1.default.resendVerificationEmail(email);
                return res.status(200).json({ message: response });
            }
            catch (error) {
                return res.status(400).json({ message: error.message });
            }
        });
    }
    verifyResendOtpEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                if (!email || !otp) {
                    return res.status(400).json({ message: 'Email và mã OTP là bắt buộc' });
                }
                const emailRegex = /^[a-zA-Z0-9](\.?[a-zA-Z0-9_-])*[a-zA-Z0-9]@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
                if (!emailRegex.test(email)) {
                    return res.status(400).json({ message: 'Định dạng email không hợp lệ' });
                }
                if (!/^\d{6}$/.test(otp)) {
                    return res.status(400).json({ message: 'OTP phải gồm 6 chữ số' });
                }
                const message = yield AuthService_1.default.verifyEmailVerificationOtp(email, otp);
                return res.status(200).json({ message });
            }
            catch (error) {
                return res.status(400).json({ message: error.message });
            }
        });
    }
}
exports.default = new AuthController();
