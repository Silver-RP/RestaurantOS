import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import ButtonComponents from "../../common/ButtonComponents";
import CartPopup from "./CartPopup";  

interface ItemProps {
  imageSrc: string;
  price: number;
  title: string;
  onDelete: () => void;
}

const FoodItemCard: React.FC<ItemProps> = ({ imageSrc, title, price, onDelete }) => {  
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleAddToCart = (quantity: number) => {   
    console.log(`Thêm ${quantity} ${title} vào giỏ hàng.`);
  };

  return (
    <div className="w-full h-auto text-white p-4 text-center">
      <div className="relative">
        <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
        <button
          className="absolute top-2 right-2 p-2"
          onClick={onDelete}
        >
          <FaTrash className="text-white hover:text-secondaryColor text-lg" />
        </button>
      </div>
      <h3 className="text-center text-lg font-restora mt-4">{title}</h3>
      <ButtonComponents
        variant="outline"
        size="small"
        className="mt-3"
        onClick={openPopup}
      >
        Thêm vào giỏ hàng
      </ButtonComponents>

      {isPopupOpen && (
        <CartPopup
          imageSrc={imageSrc}
          title={title}
          price={price}  
          onClose={closePopup}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};

export default FoodItemCard;
