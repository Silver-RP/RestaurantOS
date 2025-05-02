'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const cloudinary_1 = __importDefault(require('../config/cloudinary')); // Import cấu hình Cloudinary từ file cấu hình
const UploadImage = (file, folder) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      return new Promise((resolve, reject) => {
        // Đảm bảo truyền buffer vào upload và chỉ định các tùy chọn chính xác
        cloudinary_1.default.uploader
          .upload_stream(
            {
              resource_type: 'auto', // Tự động nhận diện loại tài nguyên (ảnh, video, ...)
              folder: folder,
              use_filename: true,
              unique_filename: false,
            },
            (error, result) => {
              if (error) {
                console.error('Error uploading image to Cloudinary:', error);
                reject(new Error('Failed to upload image'));
              }
              if (!result) {
                console.error('Error uploading image: result is undefined');
                reject(new Error('Failed to upload image'));
              } else {
                resolve(result.secure_url); // Trả về URL của ảnh đã upload
              }
            },
          )
          .end(file.buffer); // Truyền buffer vào stream upload
      });
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      throw new Error('Failed to upload image');
    }
  });
exports.default = UploadImage;
