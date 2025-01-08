import React, { useState } from 'react';
import ButtonComponents from '../../common/ButtonComponents';
import { FaRegHeart, FaTimes } from 'react-icons/fa';

interface CartPopupProps {
  imageSrc: string;
  title: string;
  price: number;
  category: string;
  thumbnails: string[];
  isNew?: boolean;
  discount?: number;
  description: string; 
  onClose: () => void;
  onAddToCart: (quantity: number) => void;
}

const CartPopup: React.FC<CartPopupProps> = ({
  imageSrc,
  title,
  price,
  category,
  thumbnails,
  isNew = false,
  discount = 0,
  description, 
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [currentImage, setCurrentImage] = useState<string>(imageSrc);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(quantity);
    onClose();
  };

  const discountedPrice =
    discount > 0 ? price - (price * discount) / 100 : price;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-bodyBackground px-8 py-8 w-fit h-fit flex flex-col lg:flex-row relative space-y-6 lg:space-y-0 lg:space-x-6">
        <button onClick={onClose} className="absolute top-2 right-2 text-xl">
          <FaTimes />
        </button>

        <div className="flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-3">
          <div className="flex-shrink-1 w-full relative">
            {isNew && (
              <span className="absolute top-2 left-0 bg-secondaryColor text-[#002B40] text-xs font-semibold px-4 py-1 mt-1 w-fit">
                New
              </span>
            )}
            {discount > 0 && (
              <span className="absolute top-10 left-0 bg-secondaryColor text-[#002B40] text-xs font-semibold px-4 py-1 mt-1 w-fit">
                -{discount}%
              </span>
            )}
            <img
              src={currentImage}
              alt={title}
              className="w-full h-auto sm:h-auto lg:h-auto object-cover mb-4"
            />
          </div>

          <div className="flex h-full justify-start items-start lg:flex-col lg:space-y-2 space-x-2 lg:space-x-0 overflow-x-scroll lg:overflow-x-hidden">
            {thumbnails.map((thumb, index) => (
              <img
                key={index}
                src={thumb}
                alt={`Thumbnail ${index + 1}`}
                className="w-22 h-20 object-cover cursor-pointer border-2 border-transparent hover:border-secondaryColor"
                onClick={() => setCurrentImage(thumb)}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 text-left text-white">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-restora mb-2">
            {title}
          </h3>
          {discount > 0 ? (
            <p className="text-lg md:text-xl text-secondaryColor mb-2">
              {`Giá: `}
              <span className="line-through mr-2">
                {price.toLocaleString()} VND
              </span>
              <span>{discountedPrice.toLocaleString()} VND</span>
            </p>
          ) : (
            <p className="text-lg md:text-xl text-secondaryColor mb-2">
              {`Giá: ${price.toLocaleString()} VND`}
            </p>
          )}
          <p className="text-md mb-2">{`Danh mục: ${category}`}</p>
          <p className="text-sm mb-4">{description}</p> 

          <div className="mb-4">
            <label htmlFor="quantity" className="block text-white">
              Số lượng
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              min="1"
              className="mt-3 w-16 md:w-20 p-1 border text-black border-gray-300"
              onChange={handleQuantityChange}
            />
          </div>

          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
            <ButtonComponents
              variant="filled"
              size="small"
              onClick={handleAddToCart}
              className="py-2 px-4"
            >
              Thêm vào giỏ hàng
            </ButtonComponents>
            <ButtonComponents
              variant="outline"
              size="small"
              onClick={() => console.log('Thêm vào danh sách yêu thích')}
              className="py-2 px-4 flex items-center justify-center hover:border-transparent hover:bg-transparent"
            >
              <FaRegHeart className="text-xl text-secondaryColor" />
            </ButtonComponents>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPopup;
