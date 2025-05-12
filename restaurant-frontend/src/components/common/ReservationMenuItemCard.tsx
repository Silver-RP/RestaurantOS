import React from 'react';
import { FiPlus } from 'react-icons/fi';

interface ReservationMenuItemCardProps {
  image: string;
  name: string;
  category: string;
  price: string;
  onAdd?: () => void;
}

const ReservationMenuItemCard: React.FC<ReservationMenuItemCardProps> = ({
  image,
  name,
  category,
  price,
  onAdd,
}) => {
  return (
    <div className="flex bg-[#0C2B40] rounded overflow-hidden shadow-md hover:scale-[1.01] transition">
      <div className="w-[100px] h-[100px] shrink-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 p-4 text-white flex flex-col justify-between">
        <div>
          <h4 className="text-base text-left font-medium">{name}</h4>
          <p className="text-sm text-left text-gray-300">{category}</p>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-secondaryColor font-semibold">{price}</span>
          <button
            onClick={onAdd}
            className="bg-secondaryColor w-6 h-6 rounded-sm text-black flex items-center justify-center"
          >
            <FiPlus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationMenuItemCard;