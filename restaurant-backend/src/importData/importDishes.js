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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
import mongoose_1 from "mongoose";
import { readFile, utils } from "xlsx";
import { v2 } from "cloudinary";
import fs_1 from "fs";
import path_1 from "path";
import dotenv_1 from "dotenv";
dotenv_1.config();
v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI environment variable is not defined.');
    process.exit(1);
}
await mongoose_1.connect(process.env.MONGO_URI);
console.log('✅ Connected to MongoDB');
var dishSchema = new mongoose_1.Schema({
    name: String,
    shortDescription: String,
    description: String,
    ingredients: String,
    price: Number,
    images: [String],
    slug: String
});
var Dish = mongoose_1.model('Dish', dishSchema);
var uploadImage = function (filePath) { return __awaiter(void 0, void 0, void 0, function () {
    var extname, newFilePath, result, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                extname = path_1.extname(filePath).toLowerCase();
                newFilePath = filePath.replace(extname, '.jpg') // Chuyển đổi ảnh sang đuôi .jpg
                ;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                fs_1.copyFileSync(filePath, newFilePath); // Sao chép file ảnh với đuôi mới
                return [4 /*yield*/, v2.uploader.upload(newFilePath, {
                        folder: 'dishes'
                    })];
            case 2:
                result = _a.sent();
                fs_1.unlinkSync(newFilePath); // Xóa ảnh tạm sau khi upload thành công
                return [2 /*return*/, result.secure_url];
            case 3:
                err_1 = _a.sent();
                console.error("\u274C Error uploading ".concat(filePath, ":"), err_1);
                fs_1.unlinkSync(newFilePath); // Xóa ảnh tạm nếu có lỗi
                throw err_1;
            case 4: return [2 /*return*/];
        }
    });
}); };
var convertToSlug = function (name) {
    return name.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
        .replace(/\s+/g, '_');
};
var workbook = readFile('dishes.xlsx');
var sheet = workbook.Sheets[workbook.SheetNames[0]];
var data = utils.sheet_to_json(sheet);
var _loop_1 = async function (item) {
    var slug = convertToSlug(item.name);
    var baseImageName = slug;
    var imagePaths = [
        path_1.join('images', "".concat(baseImageName, ".jpg")),
        path_1.join('images', "".concat(baseImageName, "_1.jpg"))
    ];
    var uploadedImages = [];
    // Upload tất cả ảnh cùng lúc
    await Promise.all(imagePaths.map(function (imgPath) { return __awaiter(void 0, void 0, void 0, function () {
        var url, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!fs_1.existsSync(imgPath)) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, uploadImage(imgPath)];
                case 2:
                    url = _a.sent();
                    uploadedImages.push(url);
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    console.warn("\u26A0\uFE0F Missing or failed to upload image: ".concat(imgPath));
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 6];
                case 5:
                    console.warn("\u26A0\uFE0F Missing image: ".concat(imgPath));
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    }); }));
    if (uploadedImages.length > 0) {
        try {
            var dish = new Dish({
                name: item.name,
                shortDescription: item.shortDescription,
                description: item.description,
                ingredients: item.ingredients,
                price: item.price,
                slug: slug,
                images: uploadedImages
            });
            await dish.save();
            console.log("\u2705 Saved: ".concat(item.name));
        }
        catch (err) {
            console.error("\u274C Failed to save dish \"".concat(item.name, "\":"), err);
        }
    }
    else {
        console.warn("\u26A0\uFE0F No images uploaded for dish \"".concat(item.name, "\". Skipping creation."));
    }
};
for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
    var item = data_1[_i];
    _loop_1(item);
}
console.log('🥳 Import hoàn tất!');
process.exit();
