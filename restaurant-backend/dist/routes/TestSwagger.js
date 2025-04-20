"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = __importDefault(require("../controller/AuthController"));
const GoogleAuthMiddleWare_1 = __importDefault(require("../middleware/GoogleAuthMiddleWare"));
const facebookAuthMiddleware_1 = __importDefault(require("../middleware/facebookAuthMiddleware"));
const swaggerOptions_1 = require("../utils/swaggerOptions");
const router = (0, express_1.Router)();
// Đăng ký Swagger metadata cho từng route
(0, swaggerOptions_1.registerSwaggerRoute)({
    path: '/auth/register',
    method: 'post',
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        email: { type: 'string', example: 'user@example.com' },
                        password: { type: 'string', example: 'password123' },
                        name: { type: 'string', example: 'John Doe' },
                    },
                    required: ['email', 'password', 'name'],
                },
            },
        },
        required: true,
    },
    tags: ['User'],
});
router.post('/register', AuthController_1.default.register);
(0, swaggerOptions_1.registerSwaggerRoute)({
    path: '/auth/login',
    method: 'post',
    summary: 'User login',
    description: 'Authenticate user with email and password',
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        email: { type: 'string', example: 'user@example.com' },
                        password: { type: 'string', example: 'password123' },
                    },
                    required: ['email', 'password'],
                },
            },
        },
        required: true,
    },
    responses: {
        200: { description: 'Successful login, returns access token' },
        401: { description: 'Unauthorized - Invalid credentials' },
    },
    tags: ['User'],
});
router.post('/login', AuthController_1.default.login);
(0, swaggerOptions_1.registerSwaggerRoute)({
    path: '/auth/refresh_token',
    method: 'post',
    summary: 'Refresh access token',
    description: 'Refresh JWT token using refresh token',
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        refreshToken: { type: 'string', example: 'your-refresh-token' },
                    },
                    required: ['refreshToken'],
                },
            },
        },
        required: true,
    },
    responses: {
        200: { description: 'New access token generated' },
        401: { description: 'Unauthorized - Invalid refresh token' },
    },
    tags: ['User'],
});
router.post('/refresh_token', AuthController_1.default.refreshAccessToken);
(0, swaggerOptions_1.registerSwaggerRoute)({
    path: '/auth/google/callback',
    method: 'get',
    summary: 'Google OAuth callback',
    description: 'Callback endpoint for Google OAuth authentication',
    responses: {
        200: { description: 'Redirects to client with token' },
        401: { description: 'Unauthorized - Google auth failed' },
    },
    tags: ['User'],
});
router.get('/google/callback', AuthController_1.default.googleCallback);
(0, swaggerOptions_1.registerSwaggerRoute)({
    path: '/auth/google-login',
    method: 'post',
    summary: 'Google login',
    description: 'Authenticate user with Google token',
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        token: { type: 'string', example: 'google-access-token' },
                    },
                    required: ['token'],
                },
            },
        },
        required: true,
    },
    responses: {
        200: { description: 'Successful Google login, returns access token' },
        401: { description: 'Unauthorized - Invalid Google token' },
    },
    tags: ['User'],
});
router.post('/google-login', GoogleAuthMiddleWare_1.default.verifyGoogleToken, AuthController_1.default.googleLogin);
(0, swaggerOptions_1.registerSwaggerRoute)({
    path: '/auth/facebook-login',
    method: 'post',
    summary: 'Facebook login',
    description: 'Authenticate user with Facebook token',
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        token: { type: 'string', example: 'facebook-access-token' },
                    },
                    required: ['token'],
                },
            },
        },
        required: true,
    },
    responses: {
        200: { description: 'Successful Facebook login, returns access token' },
        401: { description: 'Unauthorized - Invalid Facebook token' },
    },
    tags: ['User'],
});
router.post('/facebook-login', facebookAuthMiddleware_1.default.verifyFacebookToken, AuthController_1.default.facebookLogin);
(0, swaggerOptions_1.registerSwaggerRoute)({
    path: '/auth/facebook/callback',
    method: 'get',
    summary: 'Facebook OAuth callback',
    description: 'Callback endpoint for Facebook OAuth authentication',
    responses: {
        200: { description: 'Redirects to client with token' },
        401: { description: 'Unauthorized - Facebook auth failed' },
    },
    tags: ['User'],
});
router.get('/facebook/callback', AuthController_1.default.facebookCallback);
(0, swaggerOptions_1.registerSwaggerRoute)({
    path: '/auth/logout',
    method: 'post',
    summary: 'User logout',
    description: 'Log out the current user and invalidate the session',
    responses: {
        200: { description: 'Successfully logged out' },
        401: { description: 'Unauthorized - No valid session' },
    },
    tags: ['User'],
    security: [{ bearerAuth: [] }],
});
router.post('/logout', AuthController_1.default.Logout);
(0, swaggerOptions_1.registerSwaggerRoute)({
    path: '/auth/send-otp',
    method: 'post',
    summary: 'Send OTP',
    description: 'Send an OTP to the user for verification',
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        email: { type: 'string', example: 'user@example.com' },
                    },
                    required: ['email'],
                },
            },
        },
        required: true,
    },
    responses: {
        200: { description: 'OTP sent successfully' },
        400: { description: 'Bad request - Invalid email' },
    },
    tags: ['User'],
});
router.post('/send-otp', AuthController_1.default.sendOtpController);
(0, swaggerOptions_1.registerSwaggerRoute)({
    path: '/auth/verify-otp',
    method: 'post',
    summary: 'Verify OTP',
    description: 'Verify the OTP sent to the user',
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        email: { type: 'string', example: 'user@example.com' },
                        otp: { type: 'string', example: '123456' },
                    },
                    required: ['email', 'otp'],
                },
            },
        },
        required: true,
    },
    responses: {
        200: { description: 'OTP verified successfully' },
        400: { description: 'Bad request - Invalid OTP' },
    },
    tags: ['User'],
});
router.post('/verify-otp', AuthController_1.default.verifyOtpController);
(0, swaggerOptions_1.registerSwaggerRoute)({
    path: '/auth/forgot-password',
    method: 'post',
    summary: 'Forgot password',
    description: 'Initiate password reset by sending an OTP to the user',
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        email: { type: 'string', example: 'user@example.com' },
                    },
                    required: ['email'],
                },
            },
        },
        required: true,
    },
    responses: {
        200: { description: 'Password reset OTP sent' },
        400: { description: 'Bad request - Invalid email' },
    },
    tags: ['User'],
});
router.post('/forgot-password', AuthController_1.default.sendOtpController);
(0, swaggerOptions_1.registerSwaggerRoute)({
    path: '/auth/reset-password',
    method: 'post',
    summary: 'Reset password',
    description: 'Reset user password after OTP verification',
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        email: { type: 'string', example: 'user@example.com' },
                        otp: { type: 'string', example: '123456' },
                        newPassword: { type: 'string', example: 'newpassword123' },
                    },
                    required: ['email', 'otp', 'newPassword'],
                },
            },
        },
        required: true,
    },
    responses: {
        200: { description: 'Password reset successfully' },
        400: { description: 'Bad request - Invalid OTP or email' },
    },
    tags: ['User'],
});
router.post('/reset-password', AuthController_1.default.resetPassword);
(0, swaggerOptions_1.registerSwaggerRoute)({
    path: '/auth/send-otpEmail',
    method: 'post',
    summary: 'Send OTP via email',
    description: 'Send an OTP to the user via email for verification',
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        email: { type: 'string', example: 'user@example.com' },
                    },
                    required: ['email'],
                },
            },
        },
        required: true,
    },
    responses: {
        200: { description: 'OTP email sent successfully' },
        400: { description: 'Bad request - Invalid email' },
    },
    tags: ['User'],
});
router.post('/send-otpEmail', AuthController_1.default.sendOtpEmail);
(0, swaggerOptions_1.registerSwaggerRoute)({
    path: '/auth/verify-otpEmail',
    method: 'post',
    summary: 'Verify OTP via email',
    description: 'Verify the OTP sent to the user via email',
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        email: { type: 'string', example: 'user@example.com' },
                        otp: { type: 'string', example: '123456' },
                    },
                    required: ['email', 'otp'],
                },
            },
        },
        required: true,
    },
    responses: {
        200: { description: 'OTP email verified successfully' },
        400: { description: 'Bad request - Invalid OTP' },
    },
    tags: ['User'],
});
router.post('/verify-otpEmail', AuthController_1.default.sendOtpEmail);
exports.default = router;
