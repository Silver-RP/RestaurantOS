import React from "react";

interface ArticleCardProps {
  article: {
    date: string;
    title: string;
    category: string;
    description: string;
    image: string;
  };
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <div className="rounded-lg overflow-hidden flex flex-col bg-[#012B40] w-full border-none shadow-none">
      <div className="relative w-full h-[328px]">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute left-0 bg-[#FFDEA0] text-black text-xs font-bold flex items-center justify-center top-2 w-[100px] h-[25px]">
          {article.date}
        </div>
      </div>
      <div className="py-4 flex-grow flex flex-col mt-4 h-[277px]">
        <h3 className="text-lg font-bold mb-2 text-left text-16">{article.title}</h3>
        <p className="text-sm text-[#FFDEA0] mb-4 text-left text-[10px]">{article.category}</p>
        <p className="text-sm mb-4 flex-grow text-left text-[10px]">{article.description}</p>
        <div className="mt-auto">
          <button
            className="text-white flex items-center justify-center px-4 py-2 hover:bg-[#FFDEA0] hover:border-[#FFDEA0] hover:text-black"
            style={{
              backgroundColor: '#012B40',
              border: '1px solid #FFDEA0',
              width: '108px',
              height: '34px',
              borderRadius: '0px',
            }}
          >
            Đọc thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;