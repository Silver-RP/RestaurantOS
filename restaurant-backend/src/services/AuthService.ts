import bcrypt from 'bcrypt';
import { accessToken, refreshToken } from '../services/generateToken';
import User from '../models/UserModel';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { GoogleAuthExceptionMessages } from 'google-auth-library/build/src/auth/googleauth';
import axios from 'axios';
import { log } from 'console';
import crypto from "crypto";
import nodemailer from "nodemailer";

import sendOtpToPhoneNumber from "../utils/smsService"; 
dotenv.config();
interface Register {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  roles?: string;
}
interface Login {
  email: string;
  password: string;
}
interface GoogleUser {
  id: string; 
  email: string;
  googleId: string;
  userName: string;
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
      const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code"
      });
  
      console.log(tokenResponse.data);  // Kiểm tra tokenResponse
  
      const { access_token, id_token } = tokenResponse.data;
  
      // Lấy thông tin người dùng từ Google API
      const userProfileResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
          Authorization: `Bearer ${access_token}` // Đảm bảo gửi access_token từ Google
        }
      });
  
      const user = userProfileResponse.data;
  
      // Kiểm tra xem người dùng đã tồn tại chưa trong hệ thống của bạn
      let existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        existingUser = new User({
          email: user.email,
          userName: user.name,
          avatar: user.picture,
          googleId: user.id,
          isAdmin: false,
          isCashier: false,
        });
        await existingUser.save();
      }
  
      // Quay lại thông tin người dùng và Google access_token
      return {
        user: existingUser,
        accessToken: access_token,  // Trả về token từ Google OAuth
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
        userName,
        email,
        password,
        confirmPassword,
        phone, 
        roles
      } = userData;
      const existingUser = await User.findOne({
        $or: [{ email }, { userName }],
      });
      if(password !== confirmPassword){
        throw new Error('Password do not match');
      }
      // $or là gì
      // Nếu không tìm thấy user thì trả về null
      if (existingUser) {
        throw new Error('User or email already exists');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      let userRole = "user"; 
      if(roles && roles === "superadmin"){
        userRole = "superadmin";
      }
      const newUser = new User({
        userName,
        email,
        password: hashedPassword,
        phone,
        roles: userRole,
      });
      await newUser.save();
      return newUser;
    } catch (error: any) {
      console.error('Error during user registration:', error);
      throw new Error('Error during user registration: ' + error.message);
      
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
        throw new Error('Invalid credentials');
      }

      const token = accessToken(
        { id: user._id, role: user.roles},
        process.env.ACCESS_TOKEN || '',
        '20s',
      );
      const refresh_token = refreshToken({id: user._id, role: user.roles}, process.env.REFRESH_TOKEN || '', "365d"); 
      return { token, user, refresh_token };
    } catch (error: any) {
        throw new Error(error.message);
    }
  }
  // Method refresh token
  async refreshAccessToken(refreshTokenFromClient: string){
    try {
      if(!refreshTokenFromClient){
        throw new Error("No refresh token provided"); 
      }
      const decode: any = jwt.verify(refreshTokenFromClient, process.env.REFRESH_TOKEN || ''); 
      const user = await User.findById(decode.id); 
      if(!user){
        throw new Error("User not found"); 
      }
      // Tạo access token mới 
      const newAccessToken = accessToken({ id: user._id }, process.env.ACCESS_TOKEN || '', '2h');
      return { newAccessToken}; 
    } catch (error: any) {
        throw new Error(error.message);
    }
  }
  // Method login with google
  async googleLogin(googleUser: GoogleUser) {
    try {
      const { email, googleId, userName, avatar } = googleUser;
  
      // Kiểm tra xem người dùng đã tồn tại chưa
      let user = await User.findOne({ email });
      if (!user) {
        // Nếu không tồn tại, tạo mới
        user = new User({
          email, 
          userName: userName || "", 
          avatar: avatar || "",
          googleId, 
          isAdmin: false, 
          isCashier: false,
        });
        await user.save();
      }
  
      // Tạo access token sau khi đăng nhập thành công
      const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN || '', {
        expiresIn: '2h', // Thời gian hết hạn 2 giờ
      });
      const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN || '', {
        expiresIn: '365d', // Thời gian hết hạn 1 năm
      });
      
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

  // Method login with facebook
  async loginFaceBook(profile: any){
    let user = await User.findOne({facebookId: profile.id}); 

    if(!user){
      user = new User({
        email: profile.email, 
        userName: profile.name, 
        avatar: profile.picture.data.url,
        facebookId: profile.id,
        isAdmin: false,
        isCashier: false,
      })
      await user.save(); 
    }
    // Tạo token 
    const token = jwt.sign({id: user._id, name: user.userName, email: user.email}, process.env.ACCESS_TOKEN || " ", {expiresIn: '2h'});
    return {token, user};
  }
  // Method handle facebook callback
  async handleFacebookCallBack(code: string): Promise<any> {
     try {
      const response = await axios.post(`https://graph.facebook.com/v21.0/oauth/access_token`, {
        params: {
          code: code, 
          client_id: process.env.FB_CLIENT_ID, 
          client_secret: process.env.FB_CLIENT_SECRET, 
          redirect_uri: process.env.FB_REDIRECT_URI,
        }
      })
      console.log(response.data);
      
      const accessToken = response.data.access_token;
      const userResponse = await axios.get(`https://graph.facebook.com/v21.0/me`, {
        params: {
          fields: "id,name,email,picture",
          access_token: accessToken,
        }
      })
      const facebookUser = userResponse.data;
      console.log(facebookUser); 
      let user = await User.findOne({email: facebookUser.email});
      if(!user){
        user = new User({
          email: facebookUser.email, 
          userName: facebookUser.name, 
          avatar: facebookUser.picture.data.url,
          facebookId: facebookUser.id,
          isAdmin: false,
          isCashier: false,
        })
        await user.save(); 
      }
      const token = jwt.sign({id: user._id, name: user.userName, email: user.email}, process.env.ACCESS_TOKEN || " ", {expiresIn: '2h'});
      return {
        message: 'Login successful',
        token: token,
        user: {
            id: user.id,
            email: user.email,
            name: user.userName,
        }
    };
     } catch (error: any) {
      console.error('Error during Facebook OAuth callback:', error);
      throw new Error('Error during Facebook OAuth callback: ' + error.message);
      
     }

  }
  // Method facebook login
  async facebookLogin(accessToken: string){
    try {
      const response = await axios.get(`https://graph.facebook.com/v12.0/me`, {
        params: {
          fields: "id,name,email,picture",
          access_token: accessToken,
        }
      })
      const facebookUser = response.data;
      console.log(facebookUser); 
      let user = await User.findOne({email: facebookUser.email});
      if(!user){
        user = new User({
          email: facebookUser.email, 
          userName: facebookUser.name, 
          avatar: facebookUser.picture.data.url,
          facebookId: facebookUser.id,
          isAdmin: false,
          isCashier: false,
        })
        await user.save(); 
      }
      const token = jwt.sign({id: user._id, name: user.userName, email: user.email}, process.env.ACCESS_TOKEN || " ", {expiresIn: '2h'});
      return {
        message: 'Login successful',
        token: token,
        user: {
            id: user.id,
            email: user.email,
            name: user.userName,
        }
    };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Method logout 
  async logout (refreshToken: string){
    try {
      const decode: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN || ''); 
      const user = await User.findById(decode.id);
      if(!user){
        throw new Error("User not found"); 
      }
      return {message: "Logout successful"};
    } catch (error: any) {
      throw new Error(error.message);
    }
    
  }

  // Method send OTP
  async sendOtp(phone: string){
    try {
      let user = await User.findOne({phone});
      if(!user){
        user = new User({phone}); 
        await user.save();
      }
      const otp = crypto.randomInt(100000, 999999).toString();
      user.otp = otp; 
      user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 5 phut 
      await user.save(); 
      await sendOtpToPhoneNumber.sendOtpToPhoneNumber(phone, otp);
      return {
        message: "OTP sent successfully", 
  
      };
    } catch (error: any) {
      throw new Error(error.message);
      
    }
  }
  // Method verify OTP
  async verifyOtp(phone: string, otp: string){
    const user = await User.findOne({phone}); 
    if(!user){
      throw new Error ("User not found");
    }
    if(user.otp !== otp){
      throw new Error("Invalid OTP");
    }
    if (!user.otpExpiry) {
      throw new Error("OTP expiry date is missing");
  }
    if(new Date() > user.otpExpiry){
      throw new Error("OTP expired");
    }
    return {message: "OTP verified successfully"};
  }
  // Method reset password
  async resetPassword(phone: string, newPassword: string, confirmPassword: string){
    const user = await User.findOne({phone}); 
    if(!user){
      throw new Error("User not found");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10); 
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    return {message: "Password reset successfully"};
  }
  async sendOtpEmail(email: string): Promise<void>{
    const otp = crypto.randomInt(100000, 999999).toString();
    const expireAt = new Date(Date.now() + 5 * 60 * 1000); 

    // Lưu OTP vào db 
    await User.create({email, otp, otpExpiry: expireAt});
    // Gửi OTP qua email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth:
      {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      }
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "OTP for password reset",
      text: `Your OTP is ${otp}. It will expire in 5 minutes`,
    };
    await transporter.sendMail(mailOptions);

  }
  async verifyOtpEmail(email: string, otp: string): Promise<void>{
    const otpRecord  = await User.findOne({email, otp, isVerifiend: false});
    if(!otpRecord){
      throw new Error("Invalid OTP");
    }
    if (!otpRecord.expireAt) {
      console.error("exprireAt is missing or invalid");
      throw new Error("OTP expiry time is not set");
  }
  
    if(otpRecord.expireAt < new Date()){
      throw new Error("OTP expired");
    }
    otpRecord.isVerified = true;
    await otpRecord.save();

}
}
export default new AuthService();
// const authService = new AuthService();
// console.log(authService.handleGoogleCallBack("4/0AanRRrv2aLcgjZieovmCnrDT69GKjFeoLpBUHr6qK-U462a_uWrNYVRb4yslet1Gx7Xcsw"));
