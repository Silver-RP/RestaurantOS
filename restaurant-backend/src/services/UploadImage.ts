import cloudinary from "../config/cloudinary";  // Import cấu hình Cloudinary từ file cấu hình

const UploadImage = async (file: Express.Multer.File, folder: string) => {
    try {
        return new Promise<string>((resolve, reject) => {
            // Đảm bảo truyền buffer vào upload và chỉ định các tùy chọn chính xác
            cloudinary.uploader.upload_stream(
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
                }
            ).end(file.buffer); // Truyền buffer vào stream upload
        });
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw new Error('Failed to upload image');
    }
};

export default UploadImage;
