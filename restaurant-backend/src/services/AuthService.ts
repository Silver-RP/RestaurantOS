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
import Roles from '../models/RoleModel';

import {
  Register,
  Login,
  GoogleUser,
} from '../types/auth.types'; 

class AuthService {
  async handleGoogleCallBack(code: string): Promise<any> {
    try {
      const clientId = process.env.GG_CLIENT_ID || '';
      const clientSecret = process.env.GG_CLIENT_SECRET || '';
      const redirectUri = process.env.GOOGLE_REDIRECT_URI || '';
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
      const { access_token, id_token } = tokenResponse.data;
      const userProfileResponse = await axios.get(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
      const user = userProfileResponse.data;
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
      return {
        user: existingUser,
        accessToken: access_token, 
      };
    } catch (error) {
      console.error('Error during Google OAuth callback:', error);
      throw error;
    }
  }
  async register(userData: {
    username: string;
    email: string;
    password: string;
  }) {
    const { username, email, password } = userData;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email đã tồn tại trong hệ thống');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultRole = await Roles.findOne({ name: 'user' });
    if (!defaultRole) {
      throw new Error('Default role not found');
    }
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      roles: [defaultRole._id], 
      isVerified: false,
      emailVerificationToken: crypto.randomBytes(32).toString('hex'),
      emailVerificationExpires: new Date(Date.now() + 3600000), // 1h
    });
  
    await newUser.save();
  
    
    const populatedUser = await User.findById(newUser._id)
      .populate('roles', 'name'); 
  
    return populatedUser;
  }

  async login(loginUser: { email: string; password: string }) {
    const { email, password } = loginUser;
  
    const user = await User.findOne({ email }).populate('roles', 'name'); 
    if (!user) {
      throw new Error('Email not registered');
    }
  
    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      throw new Error('Password is incorrect');
    }
    const token = accessToken(
      { id: user._id, roles: user.roles },
      process.env.ACCESS_TOKEN || '',
      20
    );
  
    const refresh_token = refreshToken(
      { id: user._id, roles: user.roles },
      process.env.REFRESH_TOKEN || '',
      365 * 24 * 60 * 60
    );
  
    return { token, refresh_token, user };
  }
  
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
  async googleLogin(googleUser: GoogleUser) {
    try {
      const { email, googleId, username, avatar } = googleUser;
      let user = await User.findOne({ email });
      if (!user) {
        user = new User({
          email,
          username: username || '',
          avatar: avatar || '',
          googleId,
        });
        await user.save();
      }
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN || '',
        {
          expiresIn: 7200, 
        },
      );
      const refreshToken = jwt.sign(
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
    } catch (error: any) {
      throw new Error('Error during Google login: ' + error.message);
    }
  }
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
  async changePasswordByEmail(email: string, newPassword: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return { message: 'Password changed successfully' };
  }
  async sendOtpEmail(email: string): Promise<void> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    const expireAt = new Date(Date.now() + 5 * 60 * 1000); 
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    if (user.otpSentCount >= 5 && user.lastOtpSentAt > oneHourAgo) {
      throw new Error(
        'You have exceeded the limit for sending OTPs. Please try again later',
      );
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
      to: email,
      subject: 'OTP for password reset',
      text: `Your OTP is ${otp}. It will expire in 5 minutes`,
    };
    await transporter.sendMail(mailOptions);
  }
  async verifyOtpEmail(email: string, otp: string): Promise<string> {
    const user = await User.findOne({ email, otp });

    if (!user) {
      throw new Error('Invalid OTP');
    }

    if (user.isVerified) {
      return 'Email has already been verified'; 
    }

    if (!user.otpExpiry) {
      throw new Error('OTP expiry time is not set');
    }

    if (user.otpExpiry < new Date()) {
      throw new Error('OTP expired');
    }

    user.isVerified = true;
    user.otp = null; 
    user.otpExpiry = null;
    await user.save();

    return 'Email verified successfully';
  }
  
  async sendOtpFlexible(identifier: string): Promise<{ message: string }> {
    try {
      let user;
      const otp = crypto.randomInt(100000, 999999).toString();
      const expireAt = new Date(Date.now() + 5 * 60 * 1000); 

      const phoneRegex = /^(\+84|0)(3|5|7|8|9)\d{8}$/;
      const emailRegex =
        /^[a-zA-Z0-9](\.?[a-zA-Z0-9_-])*[a-zA-Z0-9]@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;

      if (phoneRegex.test(identifier)) {
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
        user = await User.findOne({ email: identifier });
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

