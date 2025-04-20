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
const SampleModel_1 = __importDefault(require("../models/SampleModel"));
const router = (0, express_1.Router)();
router.get('/healthcheck', (req, res) => {
    res.json({ status: 'ok' });
});
router.get('/db', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sampleData = yield SampleModel_1.default.create({
            name: 'Sample Data',
            description: 'This is a sample document',
        });
        res.status(201).json({ message: 'Data added successfully', data: sampleData });
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding data', error });
    }
}));
exports.default = router;
