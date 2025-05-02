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
const express_1 = require('express');
const UserController_1 = __importDefault(
  require('../controller/UserController'),
);
const AuthMiddleWare_1 = __importDefault(
  require('../middleware/AuthMiddleWare'),
);
const router = (0, express_1.Router)();
router.get(
  '/getAllUser',
  AuthMiddleWare_1.default.verifyToken,
  UserController_1.default.getAllUser,
);
router.get(
  '/getAllUserByUserRole',
  UserController_1.default.getAllUserByUserRole,
);
router.get('/getUserById/:userId', UserController_1.default.getUserById);
router.post('/blockUser/:userId', UserController_1.default.blockUser);
router.get('/filterUser', (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      yield UserController_1.default.filterUser(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Error filtering users' });
    }
  }),
);
exports.default = router;
