import React, { useState } from "react";

interface ProductGalleryProps {
  mainImage: string;
  thumbnails: string[];
  discount?: number;
  isNew?: boolean;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  mainImage,
  thumbnails,
  discount = 0,
  isNew = false,
}) => {
  const [selectedImage, setSelectedImage] = useState(mainImage);

  return (
    <div className="w-full items-center lg:items-start sm:items-center md:items-center lg:w-1/2 flex flex-col lg:flex-row mb-8 lg:mb-0">
      {/* Ảnh chính */}
      <div className="relative w-full overflow-hidden">
        {discount > 0 && (
          <span className="absolute top-4 left-2 bg-secondaryColor font-semibold font-sans text-black text-sm px-3 py-1 rounded">
            -{discount}%
          </span>
        )}
        {isNew && (
          <span className="absolute top-14 left-2 bg-secondaryColor font-semibold font-sans text-black text-sm px-3 py-1 rounded">
            NEW
          </span>
        )}
        <img
          src={selectedImage}
          alt="product"
          className="w-full object-cover"
        />
      </div>

      {/* Thumbnail */}
      <div className="flex lg:flex-col gap-2 mt-4 lg:mt-0 lg:ml-4 overflow-x-auto lg:overflow-y-auto max-w-full lg:max-h-[400px] items-center">
        {thumbnails.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`thumb-${idx}`}
            onClick={() => setSelectedImage(src)}
            className={`w-20 h-20 object-cover border cursor-pointer transition 
              ${selectedImage === src ? "border-secondaryColor" : "border-gray-600"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
