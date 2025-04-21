import bcrypt from 'bcrypt';
import { accessToken, refreshToken } from './GenerateToken';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { GoogleAuthExceptionMessages } from 'google-auth-library/build/src/auth/googleauth';
import axios from 'axios';
import { log } from 'console';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import sendOtpToPhoneNumber from '../utils/smsService';
dotenv.config();
import mongoose from 'mongoose';
import User from '../models/UserModel';
interface Register {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  roles: mongoose.Types.ObjectId[];
}
interface Login {
  email: string;
  password: string;
}
interface GoogleUser {
  id: string;
  email: string;
  googleId: string;
  username: string;
  avatar: string;
}

class AuthService {
  // test bằng gg => OK, và ko test được postman bởi vì postman ko có các chức của trình duyệt OAuth 2.0
  // Method handle google callback
  async handleGoogleCallBack(code: string): Promise<any> {
    try {
      const clientId = process.env.GG_CLIENT_ID || '';
      const clientSecret = process.env.GG_CLIENT_SECRET || '';
      const redirectUri = process.env.GOOGLE_REDIRECT_URI || '';

      // Gửi POST request tới Google OAuth2 token endpoint để lấy access_token
      const tokenResponse = await axios.post(
        'https://oauth2.googleapis.com/token',
        {
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        },
      );

      console.log(tokenResponse.data); // Kiểm tra tokenResponse

      const { access_token, id_token } = tokenResponse.data;

      // Lấy thông tin người dùng từ Google API
      const userProfileResponse = await axios.get(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: {
            Authorization: `Bearer ${access_token}`, // Đảm bảo gửi access_token từ Google
          },
        },
      );

      const user = userProfileResponse.data;

      // Kiểm tra xem người dùng đã tồn tại chưa trong hệ thống của bạn
      let existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        existingUser = new User({
          email: user.email,
          username: user.name,
          avatar: user.picture,
          googleId: user.id,
        });
        await existingUser.save();
      }

      // Quay lại thông tin người dùng và Google access_token
      return {
        user: existingUser,
        accessToken: access_token, // Trả về token từ Google OAuth
      };
    } catch (error) {
      console.error('Error during Google OAuth callback:', error);
      throw error;
    }
  }
  // Method register user
  async register(userData: Register) {
    try {
      const {
        username,
        email,
        password,
        confirmPassword,
        roles: roleObjectIds,
      } = userData;
      const existingUser = await User.findOne({ email });

      if (password !== confirmPassword) {
        throw new Error('Password do not match');
      }
      if (existingUser) {
        throw new Error('User or email already exists');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
    
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        roles: roleObjectIds,
        isVerified: false, // hoặc true nếu đã xác thực
        emailVerificationToken: crypto.randomBytes(32).toString('hex'),
        emailVerificationExpires: new Date(Date.now() + 3600000), // 1 giờ
      });
      await newUser.save();
      return newUser;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  // Method login user
  async login(loginUser: Login) {
    try {
      const { email, password } = loginUser;
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Email not registered');
      }
      // compare password
      const isMatch = await bcrypt.compare(password, user.password || '');
      if (!isMatch) {
        throw new Error('Password is incorrect');
      }

      const token = accessToken(
        { id: user._id, roles: user.roles },
        process.env.ACCESS_TOKEN || '',
        20,
      );
      const refresh_token = refreshToken(
        { id: user._id, role: user.roles },
        process.env.REFRESH_TOKEN || '',
        365 * 24 * 60 * 60, 
      );
      return { token, user, refresh_token };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  // Method refresh token
  async refreshAccessToken(refreshTokenFromClient: string) {
    try {
      if (!refreshTokenFromClient) {
        throw new Error('No refresh token provided');
      }
      const decode: any = jwt.verify(
        refreshTokenFromClient,
        process.env.REFRESH_TOKEN || '',
      );
      const user = await User.findById(decode.id);
      if (!user) {
        throw new Error('User not found');
      }
      // Tạo access token mới
      const newAccessToken = accessToken(
        { id: user._id },
        process.env.ACCESS_TOKEN || '',
        2, 
      );
      return { newAccessToken };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  // Method login with google
  async googleLogin(googleUser: GoogleUser) {
    try {
      const { email, googleId, username, avatar } = googleUser;

      // Kiểm tra xem người dùng đã tồn tại chưa
      let user = await User.findOne({ email });
      if (!user) {
        // Nếu không tồn tại, tạo mới
        user = new User({
          email,
          username: username || '',
          avatar: avatar || '',
          googleId,
        });
        await user.save();
      }

      // Tạo access token sau khi đăng nhập thành công
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN || '',
        {
           expiresIn: 7200 , // Thời gian hết hạn 2 giờ
        },
      );
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN || '',
        {
          expiresIn: 365 * 24 * 60 * 60  // Thời gian hết hạn 1 năm
        },
      );

      return {
        user,
        accessToken,
        refreshToken,
      };
    } catch (error: any) {
      // Xử lý lỗi khi đăng nhập Google
      throw new Error('Error during Google login: ' + error.message);
    }
  }

  // Method logout
  async logout(refreshToken: string) {
    try {
      const decode: any = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN || '',
      );
      const user = await User.findById(decode.id);
      if (!user) {
        throw new Error('User not found');
      }
      return { message: 'Logout successful' };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Method send OTP
  async sendOtp(phone: string) {
    try {
      let user = await User.findOne({ phone });
      if (!user) {
        user = new User({ phone });
        await user.save();
      }
      const otp = crypto.randomInt(100000, 999999).toString();
      user.otp = otp;
      user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 5 phut
      await user.save();
      await sendOtpToPhoneNumber.sendOtpToPhoneNumber(phone, otp);
      return {
        message: 'OTP sent successfully',
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  // Method verify OTP
  async verifyOtp(phone: string, otp: string) {
    const user = await User.findOne({ phone });
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
  }
  // Method reset password
  async changePassword(email: string, newPassword: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
  
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
  
    return { message: "Password changed successfully" };
  }
  // Method send OTP email
  async sendOtpEmail(email: string): Promise<void>{
    const user = await User.findOne({ email}); 
    if(!user){
      throw new Error("User not found");
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    const expireAt = new Date(Date.now() + 5 * 60 * 1000); // 5 phut
    const now = new Date(); 
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000); 
    if(user.otpSentCount >= 5 && user.lastOtpSentAt > oneHourAgo){

      throw new Error("You have exceeded the limit for sending OTPs. Please try again later");
    }
    user.otp = otp;
    user.otpExpiry = expireAt;
    user.otpSentCount += 1;
    user.lastOtpSentAt = now;
    await user.save(); 
    const transporter = nodemailer.createTransport({
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
    await transporter.sendMail(mailOptions);
  }
  async verifyOtpEmail(email: string, otp: string): Promise<string> {
    const user = await User.findOne({ email, otp }); // ❌ bỏ điều kiện isVerified: false

  if (!user) {
    throw new Error('Invalid OTP');
  }

  if (user.isVerified) {
    return 'Email has already been verified'; // ✅ thêm chỗ này sau khi tìm user
  }

  if (!user.otpExpiry) {
    throw new Error('OTP expiry time is not set');
  }

  if (user.otpExpiry < new Date()) {
    throw new Error('OTP expired');
  }

  user.isVerified = true;
  user.otp = null; // ✅ xóa OTP sau xác minh
  user.otpExpiry = null;
  await user.save();

  return 'Email verified successfully';
  }
  
  async sendOtpFlexible(identifier: string): Promise<{ message: string }> {
    try {
      let user;
      const otp = crypto.randomInt(100000, 999999).toString();
      const expireAt = new Date(Date.now() + 5 * 60 * 1000); // 5 phút
  
      const phoneRegex = /^(\+84|0)(3|5|7|8|9)\d{8}$/;
      const emailRegex = /^[a-zA-Z0-9](\.?[a-zA-Z0-9_-])*[a-zA-Z0-9]@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
  
      if (phoneRegex.test(identifier)) {
        // ✅ Kiểm tra tồn tại user theo số điện thoại
        user = await User.findOne({ phone: identifier });
        if (!user) {
          throw new Error('Số điện thoại không tồn tại trong hệ thống');
        }
  
        user.otp = otp;
        user.otpExpiry = expireAt;
        await user.save();
        await sendOtpToPhoneNumber.sendOtpToPhoneNumber(identifier, otp);
        return { message: 'OTP đã được gửi qua số điện thoại' };
      } else if (emailRegex.test(identifier)) {
        // ✅ Kiểm tra tồn tại user theo email
        user = await User.findOne({ email: identifier });
        if (!user) {
          throw new Error('Email không tồn tại trong hệ thống');
        }
  
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  
        if (user.otpSentCount >= 5 && user.lastOtpSentAt > oneHourAgo) {
          throw new Error('Bạn đã vượt quá số lần gửi OTP. Vui lòng thử lại sau');
        }
  
        user.otp = otp;
        user.otpExpiry = expireAt;
        user.otpSentCount += 1;
        user.lastOtpSentAt = now;
        await user.save();
  
        const transporter = nodemailer.createTransport({
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
          subject: 'OTP for verification',
          text: `Your OTP is ${otp}. It will expire in 5 minutes`,
        };
  
        await transporter.sendMail(mailOptions);
        return { message: 'OTP đã được gửi qua email' };
      } else {
        throw new Error('Số điện thoại hoặc email không hợp lệ');
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async resendVerificationEmail(email: string): Promise<string> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }
    if (user.isVerified) {
      throw new Error('Email is already verified');
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    const transporter = nodemailer.createTransport({
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

    await transporter.sendMail(mailOptions);
    return 'Verification email sent successfully';
  }
  
}
export default new AuthService();

