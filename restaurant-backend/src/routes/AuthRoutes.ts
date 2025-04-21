import { Router } from "express"; 
import AuthController from "../controller/AuthController";
import GoogleAuthMiddleWare from "../middleware/GoogleAuthMiddleWare";
// import { validateRequest } from "../middleware/";
import FacebookAuthMiddleware from "../middleware/facebookAuthMiddleware"; 
const router = Router(); 
router.post("/register", AuthController.register); // ok 
router.post("/login", AuthController.login); // ok 
router.post("/refresh-token", AuthController.refreshAccessToken); // ok 
router.get("/google/callback", AuthController.googleCallback); // ok 
router.post("/google-login",GoogleAuthMiddleWare.verifyGoogleToken, AuthController.googleLogin); // ok 
router.post("/logout", AuthController.Logout); // => ok 
// router.post("/send-otp", AuthController.sendOtpController); // ok  
router.post("/verify-otp", AuthController.verifyOtpController); // ok 
router.post("/forgot-password", AuthController.forgotPasswordHandler); // ok
router.post('/change-password', AuthController.changePassword); // ok
router.post("/send-otpEmail", AuthController.sendOtpEmail); // ok
router.post("/verify-otpEmail", AuthController.verifyOtpEmail); // ok
router.post('/resend-verification', AuthController.resendVerificationEmail);
export default router; 