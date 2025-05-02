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
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
const google_auth_library_1 = require('google-auth-library');
const client = new google_auth_library_1.OAuth2Client(process.env.GG_CLIENT_ID);
class GoogleAuthMiddleWare {
  // Xác thực token Google
  verifyGoogleToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const token = req.body.token; // Lấy token từ body của request
        if (!token) {
          return res.status(401).json({ message: 'Access Denied - No token provided' });
        }
        // Xác thực token qua Google OAuth2Client
        try {
          const ticket = yield client.verifyIdToken({
            idToken: token,
            audience: process.env.GG_CLIENT_ID, // Đảm bảo client ID của bạn khớp với Google Client ID
          });
          const payload = ticket.getPayload(); // Nhận thông tin người dùng từ payload
          console.log('payload', payload); // Kiểm tra payload
          if (payload) {
            // Lưu thông tin người dùng vào request để dùng ở các middleware sau
            req.body.googleUser = {
              email: payload.email,
              name: payload.name,
              avatar: payload.picture,
              sub: payload.sub, // Google ID
            };
            return next(); // Tiếp tục với controller hoặc middleware tiếp theo
          } else {
            return res.status(401).json({ message: 'Invalid Google token payload' });
          }
        } catch (error) {
          console.error('Error verifying token with Google OAuth2Client:', error);
          return res.status(401).json({ message: 'Access Denied - Invalid Google token' });
        }
      } catch (error) {
        console.error('Error verifying Google token:', error);
        return res.status(401).json({ message: 'Access Denied - Error verifying token' });
      }
    });
  }
}
exports.default = new GoogleAuthMiddleWare();
