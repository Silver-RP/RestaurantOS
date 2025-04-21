import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { accessToken, refreshToken } from '../services/GenerateToken';
import AuthService from '../services/AuthService';
import GoogleAuthMiddleWare from '../middleware/GoogleAuthMiddleWare';
import mongoose from 'mongoose';
class AuthController {
  // Method to register a new user
  async register(req: Request, res: Response): Promise<any> {
    try {
      const { username, email, password, confirmPassword, roles } = req.body;
      if (!username || !email || !password || !confirmPassword) {
        return res
          .status(400)
          .json({ message: 'Please enter all required fields' });
      }
      if (password !== confirmPassword) {
        return res
          .status(400)
          .json({
            message: 'Error during user registration: Password do not match',
          });
      }
      const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      const isCheckEmail = reg.test(email);
      if (!isCheckEmail) {
        return res.status(400).json({ message: 'Invalid email format' });
      }
      const regPassword =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
      const isCheckPassword = regPassword.test(password);
      if (!isCheckPassword) {
        return res.status(400).json({
          message:
            'Password must be at least 8 characters, including 1 uppercase letter, 1 lowercase letter and 1 number',
        });
      }
      // Kiểm tra và chuyển đổi roles thành ObjectId nếu có
      let roleObjectIds = [];
      if (roles && roles.length > 0) {
        try {
          roleObjectIds = roles;
          roleObjectIds = roles
            .filter((role: string) => mongoose.Types.ObjectId.isValid(role)) // Kiểm tra tính hợp lệ
            .map((role: string) => new mongoose.Types.ObjectId(role)); // Dùng `new` để khởi tạo ObjectId
        } catch (err) {
          console.error('Error during user registration:', err);

          return res.status(400).json({ message: 'Invalid role ID format' });
        }
      }
      const user = await AuthService.register({
        username,
        email,
        password,
        confirmPassword,
        roles: roleObjectIds, // dùng mảng đã convert đúng
      });
      res.status(201).json({ message: 'User created successfully', user });
    } catch (error: any) {
      console.error('Error during user registration:', error);
      res.status(400).json({ message: error.message });
    }
  }

  // Method to login a user
    async login(req: Request, res: Response): Promise<any> {
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
        } else if (!isCheckEmail) {
          return res.status(400).json({
            status: 'Error',
            message: 'Invalid email format',
          });
        }
        // Gọi AuthService để xử lý đăng nhập và lấy token
        const { token, refresh_token, user } = await AuthService.login(req.body);

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
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    }
  // Method to refresh access token
  async refreshAccessToken(req: Request, res: Response): Promise<any> {
    try {
      const { refreshToken } = req.cookies;
      const { newAccessToken } =
        await AuthService.refreshAccessToken(refreshToken);
      res.status(200).json({ accessToken: newAccessToken });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  async googleLogin(req: Request, res: Response): Promise<any> {
    try {
      const googleUser = req.body.googleUser; // Lấy thông tin người dùng từ payload đã được lưu trong middleware

      if (!googleUser) {
        return res.status(400).json({ message: 'Google user data is missing' });
      }

      // Lấy thông tin từ googleUser
      const { email, name, avatar, sub } = googleUser;

      // Gọi AuthService để xử lý Google login
      const { user, accessToken, refreshToken } = await AuthService.googleLogin(
        {
          id: sub,
          email,
          googleId: sub,
          username: name,
          avatar,
        },
      );
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
    } catch (error: any) {
      return res
        .status(400)
        .json({ message: 'Error during Google login', error: error.message });
    }
  }
  // Method to handle Google callback
  async googleCallback(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const { code } = req.query;
      if (!code) {
        return res.status(400).json({ message: 'No code provided' });
      }
      const result = await AuthService.handleGoogleCallBack(code as string);
      res.status(200).json({
        message: 'Google login successful',
        token: result.accessToken,
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  }
  // Method to logout a user
  async Logout(req: Request, res: Response): Promise<any> {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        return res.status(400).json({ message: 'No refresh token provided' });
      }
      // console.log(refreshToken);

      await AuthService.logout(refreshToken);
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
      });
      res.status(200).json({ message: 'Logout successful' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  //forgotPasswordHandler

  async forgotPasswordHandler(req: Request, res: Response): Promise<any> {
    const { phone, email } = req.body;
  
    if (!phone && !email) {
      return res.status(400).json({ message: 'Vui lòng nhập số điện thoại hoặc email' });
    }
  
    let identifier = '';
  
    if (phone && email) {
      return res.status(400).json({ message: 'Vui lòng chỉ nhập số điện thoại HOẶC email, không nhập cả hai' });
    }
  
    // Nếu nhập số điện thoại thì validate
    if (phone) {
      const phoneRegex = /^(?:\+84|0)(3|5|7|8|9)\d{8}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: 'Định dạng số điện thoại không hợp lệ' });
      }
      identifier = phone;
    }
  
    // Nếu nhập email thì validate
    if (email) {
      const emailRegex = /^[a-zA-Z0-9](\.?[a-zA-Z0-9_-])*[a-zA-Z0-9]@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Định dạng email không hợp lệ' });
      }
      identifier = email;
    }
  
    try {
      const response = await AuthService.sendOtpFlexible(identifier);
      return res.status(200).json({ message: response.message });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
      throw new Error('Gửi OTP qua SMS thất bại, vui lòng thử lại');
    }
  }
  // Method to verify OTP
  async verifyOtpController(req: Request, res: Response): Promise<any> {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res
        .status(400)
        .json({ message: 'Phone number and OTP are required' });
    }
    try {
      const response = await AuthService.verifyOtp(phone, otp);
      res.status(200).json({ message: response });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  // Method to change password
  async changePassword(req: Request, res: Response): Promise<any> {
    const { newPassword, confirmPassword } = req.body;
  
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "New password and confirm password are required",
      });
    }
  
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
  
    try {
      const response = await AuthService.resetPassword(
        phone,
        newPassword,
        confirmPassword,
      );
      res.status(200).json({ message: response });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  // Method to send OTP via email
  // Route gửi OTP
  async sendOtpEmail(req: Request, res: Response): Promise<any> {
    try {
      const { email } = req.body;

      // Kiểm tra định dạng email
      const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      const isCheckEmail = reg.test(email);
      if (!isCheckEmail) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

      // Gửi OTP qua email
      await AuthService.sendOtpEmail(email);

      return res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
  // Route xác nhận OTP
  async verifyOtpEmail(req: Request, res: Response): Promise<any> {
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
  
      const message = await AuthService.verifyOtpEmail(email, otp); // ✅ nhận về message
      return res.status(200).json({ message }); // ✅ trả về phản hồi rõ ràng
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
  // Route xác thực email 
  async resendVerificationEmail(req: Request, res: Response): Promise<any> {
    try {
      const { email } = req.body;
      if (email) {
        const emailRegex = /^[a-zA-Z0-9](\.?[a-zA-Z0-9_-])*[a-zA-Z0-9]@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ message: 'Định dạng email không hợp lệ' });
        }
      }

      const response = await AuthService.resendVerificationEmail(email);
      return res.status(200).json({ message: response });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}

export default new AuthController();
