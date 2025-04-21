"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = __importDefault(require("../controller/AuthController"));
const GoogleAuthMiddleWare_1 = __importDefault(require("../middleware/GoogleAuthMiddleWare"));
const router = (0, express_1.Router)();
router.post("/register", AuthController_1.default.register); // ok 
router.post("/login", AuthController_1.default.login); // ok 
router.post("/refresh-token", AuthController_1.default.refreshAccessToken); // ok 
router.get("/google/callback", AuthController_1.default.googleCallback); // ok 
router.post("/google-login", GoogleAuthMiddleWare_1.default.verifyGoogleToken, AuthController_1.default.googleLogin); // ok 
router.post("/logout", AuthController_1.default.Logout); // => ok 
// router.post("/send-otp", AuthController.sendOtpController); // ok  
router.post("/verify-otp", AuthController_1.default.verifyOtpController); // ok 
router.post("/forgot-password", AuthController_1.default.forgotPasswordHandler); // ok
router.post("/reset-password", AuthController_1.default.resetPassword); // ok
router.post("/send-otpEmail", AuthController_1.default.sendOtpEmail); // ok
router.post("/verify-otpEmail", AuthController_1.default.verifyOtpEmail); // ok
router.post('/resend-verification', AuthController_1.default.resendVerificationEmail);
exports.default = router;
