import { Router } from "express"; 
import AuthController from "../controller/AuthController";
import GoogleAuthMiddleWare from "../middleware/GoogleAuthMiddleWare";
import { loginSchema, registerSchema } from '../schemas/auth.schema';
import { validateRequest } from "../middleware/ValidateRequest";

const router = Router(); 
router.post("/register", validateRequest(registerSchema), AuthController.register); 
router.post(
    '/login',
    validateRequest(loginSchema),
    AuthController.login
  );
router.post("/refresh-token", AuthController.refreshAccessToken); 
router.get("/google/callback", AuthController.googleCallback); 
router.post("/google-login",GoogleAuthMiddleWare.verifyGoogleToken, AuthController.googleLogin); 
router.post("/logout", AuthController.Logout); 
 
router.post("/verify-otpEmail", AuthController.verifyOtpEmail); 
router.post("/forgot-password", AuthController.forgotPasswordHandler); 
router.post('/change-password', AuthController.changePassword); 

router.post("/resend-verification", AuthController.resendVerificationEmail);
router.post("/verify-resend-otpEmail", AuthController.verifyResendOtpEmail);
export default router; 