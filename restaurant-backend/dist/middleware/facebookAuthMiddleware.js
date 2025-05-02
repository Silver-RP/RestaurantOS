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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
// Tôi đang làm middelware xác thực Facebook
const axios_1 = __importDefault(require('axios'));
class FacebookAuthMiddleware {
  verifyFacebookToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { access_token } = req.body;
        if (!access_token) {
          return res.status(401).json({ message: 'Access Denied - No token provided' });
        }
        const url = `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${access_token}`;
        const response = yield axios_1.default.get(url);
        const { id, name, email, picture } = response.data;
        req.body.facebookUser = {
          id,
          name,
          email,
          picture,
        };
        return next();
      } catch (error) {
        console.error('Error verifying Facebook token:', error);
        return res.status(401).json({ message: 'Access Denied - Error verifying token' });
      }
    });
  }
}
exports.default = new FacebookAuthMiddleware();
