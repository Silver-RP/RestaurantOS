"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProfileController_1 = __importDefault(require("../controller/ProfileController"));
const AuthMiddleWare_1 = __importDefault(require("../middleware/AuthMiddleWare"));
const router = (0, express_1.Router)();
router.get("/getProfile/:_id", AuthMiddleWare_1.default.verifyToken, ProfileController_1.default.getUserProfile);
router.put("/updateProfile/:_id", AuthMiddleWare_1.default.verifyToken, ProfileController_1.default.updateUserProfile);
router.put("/changePasswordProfile/:_id", AuthMiddleWare_1.default.verifyToken, ProfileController_1.default.changePasswordProfile);
exports.default = router;
