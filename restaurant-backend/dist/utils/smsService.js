"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const twilio_1 = __importDefault(require("twilio"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
// Kiểm tra biến môi trường
if (!accountSid || !authToken || !fromPhoneNumber) {
    throw new Error('Missing required environment variables (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER)');
}
const client = (0, twilio_1.default)(accountSid, authToken);
class SmsService {
    sendOtpToPhoneNumber(to, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message = yield client.messages.create({
                    from: fromPhoneNumber,
                    to: to,
                    body: `Your OTP is: ${otp}`,
                });
                console.log('Message sent successfully:', message.sid); // Log thành công
            }
            catch (error) {
                console.error('Error sending OTP:', error.message); // Log chi tiết lỗi
            }
        });
    }
}
exports.default = new SmsService();
