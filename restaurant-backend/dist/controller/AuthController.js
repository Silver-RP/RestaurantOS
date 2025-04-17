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
const mongoose_1 = __importDefault(require("mongoose"));
class AuthController {
    // Method to register a new user
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Gọi AuthService để xử lý đăng ký
                const { userName, email, password, phone, roles } = req.body;
                if (!userName || !email || !password || !phone) {
                    return res.status(400).json({ message: "Please enter all required fields" });
                }
                // check email format
                const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
                const isCheckEmail = reg.test(email);
                if (!isCheckEmail) {
                    return res.status(400).json({ message: 'Invalid email format' });
                }
                // Check phone format
                const regPhone = /^\+?[0-9]{10,11}$/;
                const isCheckPhone = regPhone.test(phone);
                if (!isCheckPhone) {
                    return res.status(400).json({ message: 'Invalid phone format' });
                }
                // Check password format
                const regPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
                const isCheckPassword = regPassword.test(password);
                if (!isCheckPassword) {
                    return res
                        .status(400)
                        .json({
                        message: 'Password must be at least 8 characters, including 1 uppercase letter, 1 lowercase letter and 1 number',
                    });
                }
                // Kiểm tra và chuyển đổi roles thành ObjectId nếu có
                let roleObjectIds = [];
                if (roles && roles.length > 0) {
                    try {
                        roleObjectIds = roles;
                        roleObjectIds = roles
                            .filter((role) => mongoose_1.default.Types.ObjectId.isValid(role)) // Kiểm tra tính hợp lệ
                            .map((role) => new mongoose_1.default.Types.ObjectId(role)); // Dùng `new` để khởi tạo ObjectId
                    }
                    catch (err) {
                        return res.status(400).json({ message: "Invalid role ID format" });
                    }
                }
                const user = yield AuthService_1.default.register(req.body);
                res.status(201).json({ message: 'User created successfully', user });
            }
            catch (error) {
                console.error('Error during user registration:', error);
                res.status(400).json({ message: error.message });
            }
        });
    }
    // Method to login a user
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                // Kiểm tra định dạng email với regular expression
                const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
                const isCheckEmail = reg.test(email);
                // Kiểm tra thông tin email và password
                if (!email || !password) {
                    return res.status(400).json({
                        status: 'Error',
                        message: 'Please enter email and password',
                    });
                }
                else if (!isCheckEmail) {
                    return res.status(400).json({
                        status: 'Error',
                        message: 'Invalid email format',
                    });
                }
                // Gọi AuthService để xử lý đăng nhập và lấy token
                const { token, refresh_token, user } = yield AuthService_1.default.login(req.body);
                // Thiết lập cookie cho refresh token
                res.cookie('refreshToken', refresh_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', // Chỉ sử dụng secure cookie trong môi trường production
                    sameSite: 'none', // Bảo mật cookie
                    maxAge: 24 * 60 * 60 * 1000, // 1 ngày
                });
                // Trả về access token và thông tin người dùng
                res.status(200).json({
                    message: 'User logged in successfully',
                    user,
                    accessToken: token,
                });
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    // Method to refresh access token
    refreshAccessToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.cookies;
                const { newAccessToken } = yield AuthService_1.default.refreshAccessToken(refreshToken);
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
                const googleUser = req.body.googleUser; // Lấy thông tin người dùng từ payload đã được lưu trong middleware
                if (!googleUser) {
                    return res.status(400).json({ message: 'Google user data is missing' });
                }
                // Lấy thông tin từ googleUser
                const { email, name, avatar, sub } = googleUser;
                // Gọi AuthService để xử lý Google login
                const { user, accessToken, refreshToken } = yield AuthService_1.default.googleLogin({
                    id: sub,
                    email,
                    googleId: sub,
                    userName: name,
                    avatar,
                });
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'none',
                    maxAge: 24 * 60 * 60 * 1000, // 1 ngày
                });
                // Trả về kết quả cho frontend
                return res.status(200).json({
                    message: 'Google login successful',
                    user,
                    accessToken,
                });
            }
            catch (error) {
                return res
                    .status(400)
                    .json({ message: 'Error during Google login', error: error.message });
            }
        });
    }
    // Method to handle Google callback
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
    // Method to handle Facebook login
    facebookLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = req.body;
                if (!accessToken) {
                    return res.status(400).json({ message: 'No access token provided' });
                }
                const result = yield AuthService_1.default.facebookLogin(accessToken);
                res.status(200).json({
                    message: 'Facebook login successful',
                    token: result.token,
                    user: result.user,
                });
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    // Method to handle Facebook callback
    facebookCallback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { code } = req.query;
                if (!code) {
                    return res.status(400).json({ message: 'No code provided' });
                }
                const result = yield AuthService_1.default.handleFacebookCallBack(code);
                res.status(200).json({
                    message: 'Facebook login successful',
                    token: result.token,
                    user: result.user,
                });
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    // Method to logout a user
    Logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.cookies;
                if (!refreshToken) {
                    return res.status(400).json({ message: 'No refresh token provided' });
                }
                // console.log(refreshToken);
                yield AuthService_1.default.logout(refreshToken);
                res.clearCookie('refreshToken', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'none',
                });
                res.status(200).json({ message: 'Logout successful' });
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    // Method to send OTP
    sendOtpController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { phone } = req.body;
            if (!phone) {
                return res.status(400).json({ message: 'Phone number is required' });
            }
            try {
                const response = yield AuthService_1.default.sendOtp(phone);
                res.status(200).json({
                    message: response.message,
                });
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    // Method to verify OTP
    verifyOtpController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { phone, otp } = req.body;
            if (!phone || !otp) {
                return res
                    .status(400)
                    .json({ message: 'Phone number and OTP are required' });
            }
            try {
                const response = yield AuthService_1.default.verifyOtp(phone, otp);
                res.status(200).json({ message: response });
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    // Method to reset password
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { phone, newPassword, confirmPassword } = req.body;
            if (!phone || !newPassword || !confirmPassword) {
                return res
                    .status(400)
                    .json({
                    message: 'Phone number, new password and confirm password are required',
                });
            }
            if (newPassword !== confirmPassword) {
                return res.status(400).json({ message: 'Passwords do not match' });
            }
            try {
                const response = yield AuthService_1.default.resetPassword(phone, newPassword, confirmPassword);
                res.status(200).json({ message: response });
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    // Method to send OTP via email
    // Route gửi OTP
    sendOtpEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                // Kiểm tra định dạng email
                const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
                const isCheckEmail = reg.test(email);
                if (!isCheckEmail) {
                    return res.status(400).json({ message: 'Invalid email format' });
                }
                // Gửi OTP qua email
                yield AuthService_1.default.sendOtpEmail(email);
                return res.status(200).json({ message: 'OTP sent successfully' });
            }
            catch (error) {
                return res.status(400).json({ message: error.message });
            }
        });
    }
    // Route xác nhận OTP
    verifyOtpEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                if (!email || !otp) {
                    return res.status(400).json({ message: 'Email and OTP are required' });
                }
                // Xác nhận OTP
                const response = yield AuthService_1.default.verifyOtpEmail(email, otp);
                return res.status(200).json({ message: response });
            }
            catch (error) {
                return res.status(400).json({ message: error.message });
            }
        });
    }
}
exports.default = new AuthController();
