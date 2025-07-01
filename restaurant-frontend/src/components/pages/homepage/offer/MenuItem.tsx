import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FilledStar, HalfStar, EmptyStar } from '../../../common/StarIcons';

interface MenuItemProps {
  name: string;
  price: number;
  description: string;
  image: string;
  hoverImage: string;
  slug: string;
  average_rating: number;
}

const MenuItem: React.FC<MenuItemProps> = ({
  name,
  price,
  description,
  image,
  hoverImage,
  slug,
  average_rating,
}) => {
  const navigate = useNavigate();

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-[2px]">
        {Array.from({ length: fullStars }, (_, i) => (
          <FilledStar key={`full-${i}`} />
        ))}
        {hasHalfStar && <HalfStar />}
        {Array.from({ length: emptyStars }, (_, i) => (
          <EmptyStar key={`empty-${i}`} />
        ))}
      </div>
    );
  };

  return (
    <div
      onClick={() => navigate(`/foods/${slug}`)}
      className="group flex md:flex-row items-start md:items-center gap-2 md:gap-4 p-2 sm:p-0 cursor-pointer transition duration-300"
    >
      <div className="relative w-20 h-20 shrink-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded transition-opacity duration-300 group-hover:opacity-0"
        />
        <img
          src={hoverImage}
          alt={`${name} Hover`}
          className="absolute inset-0 w-full h-full object-cover rounded opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-1">
          <h3
            className="text-white text-base sm:text-lg truncate max-w-full"
            title={name}
          >
            {name}
          </h3>
          <p className="text-secondaryColor text-sm sm:text-base whitespace-nowrap">
            {price.toLocaleString()} VND
          </p>
        </div>

        <p
          className="text-sm text-gray-400 mt-1 hidden lg:block overflow-hidden"
          style={{
            maxHeight: '3em',
            display: 'block',
            lineHeight: '1.5em',
          }}
        >
          {description}
        </p>

        <div className="lg:hidden mt-1">{renderStars(average_rating)}</div>
      </div>
    </div>
  );
};

export default MenuItem;
