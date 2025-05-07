import React from 'react';

interface ImageUploadPreviewProps {
    images: (File | string)[];
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }

  const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({ images, onChange }) => {
    return (
      <div>
        <label className="block mb-1 text-sm font-medium text-admintext">Hình ảnh</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={onChange}
          className="block w-full"
        />
        {images.length > 0 && (
          <div className="flex gap-4 flex-wrap mt-2">
            {images.map((img, index) => (
              <img
                key={index}
                src={img instanceof File ? URL.createObjectURL(img) : img}
                alt={`preview-${index}`}
                className="w-24 h-24 object-cover rounded border"
              />
            ))}
          </div>
        )}
      </div>
    );
  };

export default ImageUploadPreview;
