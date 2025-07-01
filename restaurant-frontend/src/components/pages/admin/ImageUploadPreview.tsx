import React from 'react';
import { FiX } from 'react-icons/fi';    


interface ImageUploadPreviewProps {
  images: (File | string)[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
}

const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({ images, onChange, onRemove }) => {
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
            <div key={index} className="relative w-24 h-24 group">
            <img
              src={img instanceof File ? URL.createObjectURL(img) : img}
              alt={`preview-${index}`}
              className="w-full h-full object-cover rounded border"
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute top-[-8px] right-[-8px] bg-white rounded-full shadow p-1 hidden group-hover:block hover:bg-red-100 hover:text-red-500 transition duration-200"
            >
              <FiX size={16} />
            </button>
          </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default ImageUploadPreview;
