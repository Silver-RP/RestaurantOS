import React, { useState } from "react";
import ButtonComponents from "../../common/ButtonComponents";
import { FaTimes } from "react-icons/fa";

interface CartPopupProps {
  imageSrc: string;
  title: string;
  price: number;  
  onClose: () => void;
  onAddToCart: (quantity: number) => void;
}

const CartPopup: React.FC<CartPopupProps> = ({ imageSrc, title, price, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState<number>(1);

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-headerBackground py-10 px-8 rounded-lg w-1/3 h-fit relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-xl"><FaTimes /></button>
        <img src={imageSrc} alt={title} className="w-full h-72 object-cover mb-4" />
        <h3 className="text-center text-xl font-restora mb-2">{title}</h3>

        <p className="text-center text-lg text-secondaryColor mb-4">{`Giá: ${price.toLocaleString()} VND`}</p>
        
        <div className="mb-4">
          <label htmlFor="quantity" className="block text-white">Số lượng</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            min="1"
            className="mt-3 w-1/6 p-2 border text-black border-gray-300"
            onChange={handleQuantityChange}
          />
        </div>

        <div className="flex justify-center space-x-4">
          <ButtonComponents
            variant="filled"
            size="small"
            onClick={handleAddToCart}
            className="py-2 px-4"
          >
            Thêm vào giỏ hàng
          </ButtonComponents>
          <button
            onClick={onClose}
            className="bg-gray-300 border text-black py-2 px-4 hover:border-gray-300 hover:bg-transparent hover:text-white"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPopup;
