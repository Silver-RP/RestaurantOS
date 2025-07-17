import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import ButtonComponents from "../../common/ButtonComponents";
import CartPopup from "./CartPopup";

interface ItemProps {
  imageSrc: string;
  price: number;
  title: string;
  category: string;
  thumbnails: string[];
  description: string;
  isNew?: boolean;
  discount?: number; // Phần trăm giảm giá (0-100)
  onDelete: () => void;
}

const FoodItemCard: React.FC<ItemProps> = ({
  imageSrc,
  title,
  price,
  category,
  thumbnails,
  description,
  isNew = false,
  discount = 0,
  onDelete,
}) => {
  const [isPopupOpen, setPopupOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleOpenPopup = () => setPopupOpen(true);
  const handleClosePopup = () => setPopupOpen(false);

  const handleAddToCart = (quantity: number) => {
    console.log(`Thêm ${quantity} ${title} vào giỏ hàng.`);
  };

  const handleNavigateToDetail = () => {
    navigate(`/food-detail/${title}`);
  };

  // Tính giá sau khi giảm (nếu có)
  const discountedPrice = discount ? price - (price * discount) / 100 : price;

  return (
    <div className="w-full h-auto text-white p-4 text-center">
      <div className="relative cursor-pointer" onClick={handleNavigateToDetail}>
        <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
        <button className="absolute top-2 right-2 p-2" onClick={onDelete}>
          <FaTrash className="text-white hover:text-secondaryColor text-lg" />
        </button>
      </div>
      <h3
        className="text-center text-lg font-restora mt-4 cursor-pointer hover:text-secondaryColor"
        onClick={handleNavigateToDetail}
      >
        {title}
      </h3>

      <div className="min-h-[50px] flex flex-col items-center justify-end">
        {discount > 0 && (
          <p className="text-gray-400 font-restora line-through text-sm">
            {price.toLocaleString()} VND
          </p>
        )}
        <p className="text-xl font-restora text-secondaryColor">
          {discountedPrice.toLocaleString()} VND
        </p>
      </div>

      <ButtonComponents
        variant="outline"
        size="small"
        className="mt-3"
        onClick={handleOpenPopup}
      >
        Thêm vào giỏ hàng
      </ButtonComponents>

      {isPopupOpen && (
        <CartPopup
          imageSrc={imageSrc}
          title={title}
          price={price}
          category={category}
          thumbnails={thumbnails}
          description={description}
          isNew={isNew}
          discount={discount}
          onClose={handleClosePopup}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};

export default FoodItemCard;
