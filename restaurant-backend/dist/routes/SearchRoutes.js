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
const SearchController_1 = __importDefault(require("../controller/SearchController"));
const router = (0, express_1.Router)();
// router.get("/searchUsers",  SearchController.searchUsers);
router.get("/searchUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield SearchController_1.default.searchUsers(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error searching users" });
    }
}));
exports.default = router;
