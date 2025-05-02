'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const bcrypt_1 = __importDefault(require('bcrypt'));
const GenerateToken_1 = require('./GenerateToken');
const dotenv_1 = __importDefault(require('dotenv'));
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const axios_1 = __importDefault(require('axios'));
const crypto_1 = __importDefault(require('crypto'));
const nodemailer_1 = __importDefault(require('nodemailer'));
const smsService_1 = __importDefault(require('../utils/smsService'));
dotenv_1.default.config();
const UserModel_1 = __importDefault(require('../models/UserModel'));
const RoleModel_1 = __importDefault(require('../models/RoleModel'));
class AuthService {
  handleGoogleCallBack(code) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const clientId = process.env.GG_CLIENT_ID || '';
        const clientSecret = process.env.GG_CLIENT_SECRET || '';
        const redirectUri = process.env.GOOGLE_REDIRECT_URI || '';
        const tokenResponse = yield axios_1.default.post(
          'https://oauth2.googleapis.com/token',
          {
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
          },
        );
        const { access_token, id_token } = tokenResponse.data;
        const userProfileResponse = yield axios_1.default.get(
          'https://www.googleapis.com/oauth2/v2/userinfo',
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          },
        );
        const user = userProfileResponse.data;
        let existingUser = yield UserModel_1.default.findOne({
          email: user.email,
        });
        if (!existingUser) {
          existingUser = new UserModel_1.default({
            email: user.email,
            username: user.name,
            avatar: user.picture,
            googleId: user.id,
          });
          yield existingUser.save();
        }
        return {
          user: existingUser,
          accessToken: access_token,
        };
      } catch (error) {
        console.error('Error during Google OAuth callback:', error);
        throw error;
      }
    });
  }
  register(userData) {
    return __awaiter(this, void 0, void 0, function* () {
      const { username, email, password } = userData;
      const existingUser = yield UserModel_1.default.findOne({ email });
      if (existingUser) {
        throw new Error('Email đã tồn tại trong hệ thống');
      }
      const hashedPassword = yield bcrypt_1.default.hash(password, 10);
      const defaultRole = yield RoleModel_1.default.findOne({ name: 'user' });
      if (!defaultRole) {
        throw new Error('Default role not found');
      }
      const newUser = new UserModel_1.default({
        username,
        email,
        password: hashedPassword,
        roles: [defaultRole._id],
        isVerified: false,
        emailVerificationToken: crypto_1.default
          .randomBytes(32)
          .toString('hex'),
        emailVerificationExpires: new Date(Date.now() + 3600000), // 1h
      });
      yield newUser.save();
      const populatedUser = yield UserModel_1.default
        .findById(newUser._id)
        .populate('roles', 'name');
      return populatedUser;
    });
  }
  login(loginUser) {
    return __awaiter(this, void 0, void 0, function* () {
      const { email, password } = loginUser;
      const user = yield UserModel_1.default
        .findOne({ email })
        .populate('roles', 'name');
      if (!user) {
        throw new Error('Email not registered');
      }
      const isMatch = yield bcrypt_1.default.compare(
        password,
        user.password || '',
      );
      if (!isMatch) {
        throw new Error('Password is incorrect');
      }
      const token = (0, GenerateToken_1.accessToken)(
        { id: user._id, roles: user.roles },
        process.env.ACCESS_TOKEN || '',
        60,
      );
      const refresh_token = (0, GenerateToken_1.refreshToken)(
        { id: user._id, roles: user.roles },
        process.env.REFRESH_TOKEN || '',
        365 * 24 * 60 * 60,
      );
      return { token, refresh_token, user };
    });
  }
  refreshAccessToken(refreshTokenFromClient) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        if (!refreshTokenFromClient) {
          throw new Error('No refresh token provided');
        }
        const decode = jsonwebtoken_1.default.verify(
          refreshTokenFromClient,
          process.env.REFRESH_TOKEN || '',
        );
        const user = yield UserModel_1.default.findById(decode.id);
        if (!user) {
          throw new Error('User not found');
        }
        const newAccessToken = (0, GenerateToken_1.accessToken)(
          { id: user._id },
          process.env.ACCESS_TOKEN || '',
          60,
        );
        return { newAccessToken };
      } catch (error) {
        throw new Error(error.message);
      }
    });
  }
  googleLogin(googleUser) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { email, googleId, username, avatar } = googleUser;
        let user = yield UserModel_1.default.findOne({ email });
        if (!user) {
          user = new UserModel_1.default({
            email,
            username: username || '',
            avatar: avatar || '',
            googleId,
          });
          yield user.save();
        }
        const accessToken = jsonwebtoken_1.default.sign(
          { id: user._id },
          process.env.ACCESS_TOKEN || '',
          {
            expiresIn: 7200,
          },
        );
        const refreshToken = jsonwebtoken_1.default.sign(
          { id: user._id },
          process.env.REFRESH_TOKEN || '',
          {
            expiresIn: 365 * 24 * 60 * 60,
          },
        );
        return {
          user,
          accessToken,
          refreshToken,
        };
      } catch (error) {
        throw new Error('Error during Google login: ' + error.message);
      }
    });
  }
  logout(refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const decode = jsonwebtoken_1.default.verify(
          refreshToken,
          process.env.REFRESH_TOKEN || '',
        );
        const user = yield UserModel_1.default.findById(decode.id);
        if (!user) {
          throw new Error('User not found');
        }
        return { message: 'Logout successful' };
      } catch (error) {
        throw new Error(error.message);
      }
    });
  }
  changePasswordByEmail(email, newPassword) {
    return __awaiter(this, void 0, void 0, function* () {
      const user = yield UserModel_1.default.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }
      if (!user.otpVerifiedForChangePassword) {
        throw new Error('You must verify OTP before changing password');
      }
      const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
      user.password = hashedPassword;
      // Sau khi đổi mật khẩu xong → hủy flag
      user.otpVerifiedForChangePassword = false;
      yield user.save();
      return { message: 'Password changed successfully' };
    });
  }
  verifyForgotPasswordOtp(email, otp) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      const user = yield UserModel_1.default.findOne({ email });
      if (!user) throw new Error('User not found');
      if (
        ((_a = user.changePasswordOtp) === null || _a === void 0
          ? void 0
          : _a.trim()) !== otp.trim()
      ) {
        throw new Error('Invalid OTP');
      }
      if (
        !user.changePasswordOtpExpiry ||
        user.changePasswordOtpExpiry < new Date()
      ) {
        throw new Error('OTP expired');
      }
      user.changePasswordOtp = null;
      user.changePasswordOtpExpiry = null;
      user.otpVerifiedForChangePassword = true;
      yield user.save();
      return 'OTP verified. You can now reset your password.';
    });
  }
  sendOtpFlexible(identifier) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        let user;
        const otp = crypto_1.default.randomInt(100000, 999999).toString();
        const expireAt = new Date(Date.now() + 5 * 60 * 1000);
        const phoneRegex = /^(\+84|0)(3|5|7|8|9)\d{8}$/;
        const emailRegex =
          /^[a-zA-Z0-9](\.?[a-zA-Z0-9_-])*[a-zA-Z0-9]@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
        if (phoneRegex.test(identifier)) {
          user = yield UserModel_1.default.findOne({ phone: identifier });
          if (!user) {
            throw new Error('Số điện thoại không tồn tại trong hệ thống');
          }
          user.phoneOtp = otp;
          user.phoneOtpExpiry = expireAt;
          yield user.save();
          yield smsService_1.default.sendOtpToPhoneNumber(identifier, otp);
          return { message: 'OTP đã được gửi qua số điện thoại' };
        } else if (emailRegex.test(identifier)) {
          user = yield UserModel_1.default.findOne({ email: identifier });
          if (!user) {
            throw new Error('Email không tồn tại trong hệ thống');
          }
          const now = new Date();
          const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
          if (user.otpSentCount >= 5 && user.lastOtpSentAt > oneHourAgo) {
            throw new Error(
              'Bạn đã vượt quá số lần gửi OTP. Vui lòng thử lại sau',
            );
          }
          user.changePasswordOtp = otp;
          user.changePasswordOtpExpiry = expireAt;
          user.otpSentCount += 1;
          user.lastOtpSentAt = now;
          yield user.save();
          const transporter = nodemailer_1.default.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            secure: process.env.MAIL_ENCRYPTION === 'ssl',
            auth: {
              user: process.env.MAIL_USERNAME,
              pass: process.env.MAIL_PASSWORD,
            },
          });
          const mailOptions = {
            from: process.env.MAIL_FROM_ADDRESS,
            to: identifier,
            subject: 'OTP for password reset',
            text: `Your OTP is ${otp}. It will expire in 5 minutes`,
          };
          yield transporter.sendMail(mailOptions);
          return { message: 'OTP đã được gửi qua email' };
        } else {
          throw new Error('Số điện thoại hoặc email không hợp lệ');
        }
      } catch (error) {
        throw new Error(error.message);
      }
    });
  }
  resendVerificationEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
      const user = yield UserModel_1.default.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }
      if (user.isEmailVerified) {
        throw new Error('Email is already verified');
      }
      const otp = crypto_1.default.randomInt(100000, 999999).toString();
      const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      if (user.otpSentCount >= 5 && user.lastOtpSentAt > oneHourAgo) {
        throw new Error(
          'You have exceeded the OTP request limit. Please try again later.',
        );
      }
      user.emailVerificationOtp = otp;
      user.emailVerificationOtpExpiry = otpExpiry;
      user.otpSentCount += 1;
      user.lastOtpSentAt = now;
      yield user.save();
      const transporter = nodemailer_1.default.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: process.env.MAIL_ENCRYPTION === 'ssl',
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      });
      const mailOptions = {
        from: process.env.MAIL_FROM_ADDRESS,
        to: email,
        subject: 'Verify Your Email Address',
        text: `Your verification OTP is ${otp}. It will expire in 5 minutes.`,
      };
      yield transporter.sendMail(mailOptions);
      return 'Verification email sent successfully';
    });
  }
  verifyEmailVerificationOtp(email, otp) {
    return __awaiter(this, void 0, void 0, function* () {
      const user = yield UserModel_1.default.findOne({ email });
      if (!user) throw new Error('Không tìm thấy người dùng');
      if (user.isEmailVerified) {
        return 'Email đã được xác minh trước đó';
      }
      if (user.emailVerificationOtp !== otp) {
        throw new Error('Mã OTP không đúng');
      }
      if (
        !user.emailVerificationOtpExpiry ||
        user.emailVerificationOtpExpiry < new Date()
      ) {
        throw new Error('OTP đã hết hạn');
      }
      user.isEmailVerified = true;
      user.emailVerificationOtp = null;
      user.emailVerificationOtpExpiry = null;
      yield user.save();
      return 'Xác minh email thành công';
    });
  }
}
exports.default = new AuthService();
