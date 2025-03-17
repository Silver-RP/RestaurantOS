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
const bcrypt_1 = __importDefault(require("bcrypt"));
const GenerateToken_1 = require("./GenerateToken");
const UserModel_1 = __importDefault(require("../models/UserModel"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const smsService_1 = __importDefault(require("../utils/smsService"));
dotenv_1.default.config();
class AuthService {
    // test bằng gg => OK, và ko test được postman bởi vì postman ko có các chức của trình duyệt OAuth 2.0
    // Method handle google callback
    handleGoogleCallBack(code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clientId = process.env.GG_CLIENT_ID || '';
                const clientSecret = process.env.GG_CLIENT_SECRET || '';
                const redirectUri = process.env.GOOGLE_REDIRECT_URI || '';
                // Gửi POST request tới Google OAuth2 token endpoint để lấy access_token
                const tokenResponse = yield axios_1.default.post('https://oauth2.googleapis.com/token', {
                    code,
                    client_id: clientId,
                    client_secret: clientSecret,
                    redirect_uri: redirectUri,
                    grant_type: 'authorization_code',
                });
                console.log(tokenResponse.data); // Kiểm tra tokenResponse
                const { access_token, id_token } = tokenResponse.data;
                // Lấy thông tin người dùng từ Google API
                const userProfileResponse = yield axios_1.default.get('https://www.googleapis.com/oauth2/v2/userinfo', {
                    headers: {
                        Authorization: `Bearer ${access_token}`, // Đảm bảo gửi access_token từ Google
                    },
                });
                const user = userProfileResponse.data;
                // Kiểm tra xem người dùng đã tồn tại chưa trong hệ thống của bạn
                let existingUser = yield UserModel_1.default.findOne({ email: user.email });
                if (!existingUser) {
                    existingUser = new UserModel_1.default({
                        email: user.email,
                        userName: user.name,
                        avatar: user.picture,
                        googleId: user.id,
                    });
                    yield existingUser.save();
                }
                // Quay lại thông tin người dùng và Google access_token
                return {
                    user: existingUser,
                    accessToken: access_token, // Trả về token từ Google OAuth
                };
            }
            catch (error) {
                console.error('Error during Google OAuth callback:', error);
                throw error;
            }
        });
    }
    // Method register user
    register(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userName, email, password, confirmPassword, phone, roles: roleObjectIds, } = userData;
                const existingUser = yield UserModel_1.default.findOne({
                    $or: [{ email }, { userName }],
                });
                if (password !== confirmPassword) {
                    throw new Error('Password do not match');
                }
                // $or là gì
                // Nếu không tìm thấy user thì trả về null
                if (existingUser) {
                    throw new Error('User or email already exists');
                }
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const newUser = new UserModel_1.default({
                    userName,
                    email,
                    password: hashedPassword,
                    phone,
                    roles: roleObjectIds,
                });
                yield newUser.save();
                return newUser;
            }
            catch (error) {
                console.error('Error during user registration:', error);
                throw new Error('Error during user registration: ' + error.message);
            }
        });
    }
    // Method login user
    login(loginUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = loginUser;
                const user = yield UserModel_1.default.findOne({ email });
                if (!user) {
                    throw new Error('Email not registered');
                }
                // compare password
                const isMatch = yield bcrypt_1.default.compare(password, user.password || '');
                if (!isMatch) {
                    throw new Error('Invalid credentials');
                }
                const token = (0, GenerateToken_1.accessToken)({ id: user._id, roles: user.roles }, process.env.ACCESS_TOKEN || '', '20s');
                const refresh_token = (0, GenerateToken_1.refreshToken)({ id: user._id, role: user.roles }, process.env.REFRESH_TOKEN || '', '365d');
                return { token, user, refresh_token };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    // Method refresh token
    refreshAccessToken(refreshTokenFromClient) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!refreshTokenFromClient) {
                    throw new Error('No refresh token provided');
                }
                const decode = jsonwebtoken_1.default.verify(refreshTokenFromClient, process.env.REFRESH_TOKEN || '');
                const user = yield UserModel_1.default.findById(decode.id);
                if (!user) {
                    throw new Error('User not found');
                }
                // Tạo access token mới
                const newAccessToken = (0, GenerateToken_1.accessToken)({ id: user._id }, process.env.ACCESS_TOKEN || '', '2h');
                return { newAccessToken };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    // Method login with google
    googleLogin(googleUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, googleId, userName, avatar } = googleUser;
                // Kiểm tra xem người dùng đã tồn tại chưa
                let user = yield UserModel_1.default.findOne({ email });
                if (!user) {
                    // Nếu không tồn tại, tạo mới
                    user = new UserModel_1.default({
                        email,
                        userName: userName || '',
                        avatar: avatar || '',
                        googleId,
                    });
                    yield user.save();
                }
                // Tạo access token sau khi đăng nhập thành công
                const accessToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.ACCESS_TOKEN || '', {
                    expiresIn: '2h', // Thời gian hết hạn 2 giờ
                });
                const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.REFRESH_TOKEN || '', {
                    expiresIn: '365d', // Thời gian hết hạn 1 năm
                });
                return {
                    user,
                    accessToken,
                    refreshToken,
                };
            }
            catch (error) {
                // Xử lý lỗi khi đăng nhập Google
                throw new Error('Error during Google login: ' + error.message);
            }
        });
    }
    // Method login with facebook
    loginFaceBook(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield UserModel_1.default.findOne({ facebookId: profile.id });
            if (!user) {
                user = new UserModel_1.default({
                    email: profile.email,
                    userName: profile.name,
                    avatar: profile.picture.data.url,
                    facebookId: profile.id,
                    isAdmin: false,
                    isCashier: false,
                });
                yield user.save();
            }
            // Tạo token
            const token = jsonwebtoken_1.default.sign({ id: user._id, name: user.userName, email: user.email }, process.env.ACCESS_TOKEN || ' ', { expiresIn: '2h' });
            return { token, user };
        });
    }
    // Method handle facebook callback
    handleFacebookCallBack(code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.post(`https://graph.facebook.com/v21.0/oauth/access_token`, {
                    params: {
                        code: code,
                        client_id: process.env.FB_CLIENT_ID,
                        client_secret: process.env.FB_CLIENT_SECRET,
                        redirect_uri: process.env.FB_REDIRECT_URI,
                    },
                });
                console.log(response.data);
                const accessToken = response.data.access_token;
                const userResponse = yield axios_1.default.get(`https://graph.facebook.com/v21.0/me`, {
                    params: {
                        fields: 'id,name,email,picture',
                        access_token: accessToken,
                    },
                });
                const facebookUser = userResponse.data;
                console.log(facebookUser);
                let user = yield UserModel_1.default.findOne({ email: facebookUser.email });
                if (!user) {
                    user = new UserModel_1.default({
                        email: facebookUser.email,
                        userName: facebookUser.name,
                        avatar: facebookUser.picture.data.url,
                        facebookId: facebookUser.id,
                        isAdmin: false,
                        isCashier: false,
                    });
                    yield user.save();
                }
                const token = jsonwebtoken_1.default.sign({ id: user._id, name: user.userName, email: user.email }, process.env.ACCESS_TOKEN || ' ', { expiresIn: '2h' });
                return {
                    message: 'Login successful',
                    token: token,
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.userName,
                    },
                };
            }
            catch (error) {
                console.error('Error during Facebook OAuth callback:', error);
                throw new Error('Error during Facebook OAuth callback: ' + error.message);
            }
        });
    }
    // Method facebook login
    facebookLogin(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`https://graph.facebook.com/v12.0/me`, {
                    params: {
                        fields: 'id,name,email,picture',
                        access_token: accessToken,
                    },
                });
                const facebookUser = response.data;
                console.log(facebookUser);
                let user = yield UserModel_1.default.findOne({ email: facebookUser.email });
                if (!user) {
                    user = new UserModel_1.default({
                        email: facebookUser.email,
                        userName: facebookUser.name,
                        avatar: facebookUser.picture.data.url,
                        facebookId: facebookUser.id,
                        isAdmin: false,
                        isCashier: false,
                    });
                    yield user.save();
                }
                const token = jsonwebtoken_1.default.sign({ id: user._id, name: user.userName, email: user.email }, process.env.ACCESS_TOKEN || ' ', { expiresIn: '2h' });
                return {
                    message: 'Login successful',
                    token: token,
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.userName,
                    },
                };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    // Method logout
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decode = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN || '');
                const user = yield UserModel_1.default.findById(decode.id);
                if (!user) {
                    throw new Error('User not found');
                }
                return { message: 'Logout successful' };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    // Method send OTP
    sendOtp(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield UserModel_1.default.findOne({ phone });
                if (!user) {
                    user = new UserModel_1.default({ phone });
                    yield user.save();
                }
                const otp = crypto_1.default.randomInt(100000, 999999).toString();
                user.otp = otp;
                user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 5 phut
                yield user.save();
                yield smsService_1.default.sendOtpToPhoneNumber(phone, otp);
                return {
                    message: 'OTP sent successfully',
                };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    // Method verify OTP
    verifyOtp(phone, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserModel_1.default.findOne({ phone });
            if (!user) {
                throw new Error('User not found');
            }
            if (user.otp !== otp) {
                throw new Error('Invalid OTP');
            }
            if (!user.otpExpiry) {
                throw new Error('OTP expiry date is missing');
            }
            if (new Date() > user.otpExpiry) {
                throw new Error('OTP expired');
            }
            return { message: 'OTP verified successfully' };
        });
    }
    // Method reset password
    resetPassword(phone, newPassword, confirmPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserModel_1.default.findOne({ phone });
            if (!user) {
                throw new Error('User not found');
            }
            const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
            user.password = hashedPassword;
            user.otp = null;
            user.otpExpiry = null;
            yield user.save();
            return { message: 'Password reset successfully' };
        });
    }
    // Method send OTP email
    sendOtpEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserModel_1.default.findOne({ email });
            if (!user) {
                throw new Error("User not found");
            }
            const otp = crypto_1.default.randomInt(100000, 999999).toString();
            const expireAt = new Date(Date.now() + 5 * 60 * 1000); // 5 phut
            const now = new Date();
            const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
            if (user.otpSentCount >= 5 && user.lastOtpSentAt > oneHourAgo) {
                throw new Error("You have exceeded the limit for sending OTPs. Please try again later");
            }
            user.otp = otp;
            user.otpExpiry = expireAt;
            user.otpSentCount += 1;
            user.lastOtpSentAt = now;
            // Lưu OTP vào db 
            yield UserModel_1.default.create({ email, otp, otpExpiry: expireAt });
            // Gửi OTP qua email
            const transporter = nodemailer_1.default.createTransport({
                host: process.env.MAIL_HOST,
                port: Number(process.env.MAIL_PORT),
                secure: process.env.MAIL_ENCRYPTION === "ssl",
                auth: {
                    user: process.env.MAIL_USERNAME,
                    pass: process.env.MAIL_PASSWORD,
                }
            });
            const mailOptions = {
                from: process.env.MAIL_FROM_ADDRESS,
                to: email,
                subject: 'OTP for password reset',
                text: `Your OTP is ${otp}. It will expire in 5 minutes`,
            };
            yield transporter.sendMail(mailOptions);
        });
    }
    verifyOtpEmail(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const otpRecord = yield UserModel_1.default.findOne({ email, otp, isVerifiend: false });
            if (!otpRecord) {
                throw new Error('Invalid OTP');
            }
            if (!otpRecord.expireAt) {
                console.error('exprireAt is missing or invalid');
                throw new Error('OTP expiry time is not set');
            }
            if (otpRecord.expireAt < new Date()) {
                throw new Error('OTP expired');
            }
            otpRecord.isVerified = true;
            yield otpRecord.save();
        });
    }
}
exports.default = new AuthService();
