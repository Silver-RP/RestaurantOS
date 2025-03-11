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
const express_1 = require("express");
const StaffController_1 = __importDefault(require("../controller/StaffController"));
const router = (0, express_1.Router)();
router.get("/getAllStaff", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield StaffController_1.default.getAllStaff(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching staff" });
    }
}));
router.post("/createStaff", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield StaffController_1.default.createStaff(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating staff" });
    }
}));
router.put("/updateStaff/:staffId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield StaffController_1.default.updateStaff(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating staff" });
    }
}));
router.delete("/deleteStaff/:staffId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield StaffController_1.default.deleteStaff(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting staff" });
    }
}));
router.get("/filterStaff", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield StaffController_1.default.filterStaff(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error filtering staff" });
    }
}));
exports.default = router;
