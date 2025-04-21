import React from "react";
import Badge from "./Badge";
import ButtonComponents from "./ButtonComponents";

interface PostcardProps {
  badgeText: string;
  title: string;
  category: string;
  description: string;
  image: string;
  onReadMore?: () => void;
}

const PostCard: React.FC<PostcardProps> = ({
  badgeText,
  title,
  category,
  description,
  image,
  onReadMore,
}) => {
  return (
    <div className="bg-bodyBackground text-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-[250px] object-cover"
        />
        <div className="absolute top-4 left-4">
          <Badge text={badgeText} />
        </div>
      </div>

      <div className="py-6">
        <h2 className="text-xl font-restora font-thin mb-2">{title}</h2>
        <p className="uppercase text-secondaryColor text-sm mb-4">{category}</p>
        <p className="text-gray-400 text-sm mb-6">{description}</p>
        <ButtonComponents 
            variant="outline"
            size="small"
            onClick={onReadMore}>
            Đọc thêm
        </ButtonComponents>
      </div>
    </div>
  );
};

export default PostCard;