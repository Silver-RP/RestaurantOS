import cloudinary from '../config/cloudinary'; 

const UploadImage = async (file: Express.Multer.File, folder: string) => {
  try {
    return new Promise<string>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: 'auto',
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
              resolve(result.secure_url); 
            }
          },
        )
        .end(file.buffer); 
    });
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};

export default UploadImage;
