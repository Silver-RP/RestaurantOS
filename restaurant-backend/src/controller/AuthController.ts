import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "../models/userModel";
import { accessToken, refreshToken } from '../services/generateToken';
import AuthService from "../services/AuthService";
import GoogleAuthMiddleWare from "../middleware/GoogleAuthMiddleWare";
class AuthController {

  // Register a new user
  async register(req: Request, res: Response):Promise<any>{
    try {
      // Gọi AuthService để xử lý đăng ký
      const user = await AuthService.register(req.body);
      res.status(201).json({ message: 'User created successfully', user });
    } catch (error: any) {
      // Phản hồi lỗi chi tiết về email hoặc username đã tồn tại
      if (error.message.includes('Email already exists')) {
        return res.status(400).json({ message: 'Email is already registered. Please use a different email.' });
      }
      if (error.message.includes('Username already exists')) {
        return res.status(400).json({ message: 'Username is already taken. Please choose another one.' });
      }
      // Phản hồi lỗi chung
      res.status(400).json({ message: error.message });
    }
  }

  // Login a user
  async login(req: Request, res: Response):Promise<any>{
    try {
      const { email, password } = req.body;

      // Kiểm tra định dạng email với regular expression
      const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      const isCheckEmail = reg.test(email);

      // Kiểm tra thông tin email và password
      if (!email || !password) {
        return res.status(400).json({
          status: "Error",
          message: "Please enter email and password",
        });
      } else if (!isCheckEmail) {
        return res.status(400).json({
          status: "Error",
          message: "Invalid email format",
        });
      }

      // Gọi AuthService để xử lý đăng nhập và lấy token
      const { token, refresh_token, user } = await AuthService.login(req.body);

      // Thiết lập cookie cho refresh token
      res.cookie("refreshToken", refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Chỉ sử dụng secure cookie trong môi trường production
        sameSite: "none", // Bảo mật cookie
        maxAge: 24 * 60 * 60 * 1000, // 1 ngày
      });

      // Trả về access token và thông tin người dùng
      res.status(200).json({
        message: "User logged in successfully",
        user,
        accessToken: token,
      });

    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  // Làm mới Access Token 
  async refreshAccessToken (req: Request, res: Response): Promise<any> {
    try {
      const {refreshToken} = req.cookies; 
      const { newAccessToken } = await AuthService.refreshAccessToken(refreshToken);
      res.status(200).json({accessToken: newAccessToken});
    } catch (error: any) {
      res.status(400).json({message: error.message}); 
    }
  }
  async googleLogin(req: Request, res: Response): Promise<any> {
    try {
      const googleUser = req.body.googleUser;  // Lấy thông tin người dùng từ payload đã được lưu trong middleware
  
      if (!googleUser) {
        return res.status(400).json({ message: "Google user data is missing" });
      }
  
      // Lấy thông tin từ googleUser
      const { email, name, avatar, sub } = googleUser;
  
      // Gọi AuthService để xử lý Google login
      const { user, accessToken } = await AuthService.googleLogin({
        id: sub,
        email,
        googleId: sub,
        userName: name,
        avatar
      });
  
      // Trả về kết quả cho frontend
      return res.status(200).json({
        message: "Google login successful",
        user,
        accessToken,
      });
  
    } catch (error: any) {
      return res.status(400).json({ message: "Error during Google login", error: error.message });
    }
  }
  
  async googleCallback(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { code } = req.query; 
    if(!code){
      return res.status(400).json({message: "No code provided"}); 
    }
    const result = await AuthService.handleGoogleCallBack(code as string); 
    res.status(200).json({
      message: "Google login successful",
      token: result.accessToken, 
      user: result.user
    })
    } catch (error) {
      next(error)
    }
    
  }
  async loginFacebook(req: Request, res: Response): Promise<any> {
    // try {
    //   const { access_token } = req.body; 
    //   const profile = req.body.profile;
    //   const { user, token } = await AuthService.loginFaceBook();
    //   res.status(200).json({
    //     message: "Facebook login successful",
    //     user,
    //     accessToken: token,
    //   });
    // } catch (error: any) {
    //   res.status(400).json({message: error
      
    // }
  }
  async facebookCallback(req: Request, res: Response): Promise<any> {
    try {
      const { code} = req.query; 
      if(!code){
        return res.status(400).json({message: "No code provided"}); 

      }
      const result = await AuthService.handleFacebookCallBack(code as string); 
      res.status(200).json({
        message: "Facebook login successful",
        token: result.token, 
        user: result.user
      })
    } catch (error: any) {
      res.status(400).json({message: error.message});
    }
  } 
}

export default new AuthController();
