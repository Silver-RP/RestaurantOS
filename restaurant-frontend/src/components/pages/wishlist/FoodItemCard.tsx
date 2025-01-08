import React, { useState } from "react";
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
  discount?: number;
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

  const handleOpenPopup = () => setPopupOpen(true);
  const handleClosePopup = () => setPopupOpen(false);

  const handleAddToCart = (quantity: number) => {
    console.log(`Thêm ${quantity} ${title} vào giỏ hàng.`);
  };

  return (
    <div className="w-full h-auto text-white p-4 text-center">
      <div className="relative">
        <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
        <button className="absolute top-2 right-2 p-2" onClick={onDelete}>
          <FaTrash className="text-white hover:text-secondaryColor text-lg" />
        </button>
      </div>
      <h3 className="text-center text-lg font-restora mt-4">{title}</h3>
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
