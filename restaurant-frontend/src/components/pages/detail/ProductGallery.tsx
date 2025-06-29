import React, { useState } from 'react';

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
    <div className="flex flex-col-reverse lg:flex-row gap-6 w-full">
      <div className="flex lg:flex-col gap-2 lg:overflow-y-auto overflow-x-auto max-h-[500px] lg:max-w-[120px]">
        {thumbnails.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`thumb-${idx}`}
            onClick={() => setSelectedImage(src)}
            className={`w-20 h-20 object-fit object-cover rounded-md cursor-pointer transition-all border-2 ${
              selectedImage === src
                ? 'border-secondaryColor'
                : 'border-transparent hover:border-gray-400'
            }`}
          />
        ))}
      </div>

      <div
        className="relative flex-1 h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] 2xl:h-[700px] flex justify-center items-center overflow-hidden rounded-lg shadow-md bg-white"
      >
        {discount > 0 && (
          <span className="absolute top-4 left-4 bg-secondaryColor text-black text-xs px-2 py-1">
            {discount}% OFF
          </span>
        )}
        {isNew && (
          <span className="absolute top-14 left-4 bg-secondaryColor text-black text-xs font-semibold px-2 py-1">
            NEW
          </span>
        )}
        <img
          src={selectedImage}
          alt="product"
        className="h-full w-full object-cover transition-all duration-300"
        />
      </div>
    </div>
  );
};

export default ProductGallery;
