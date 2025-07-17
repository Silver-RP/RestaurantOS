import React from 'react';
import ButtonComponents from '../../../common/ButtonComponents';
import { PostType } from '../../../../types/PostType'; // Import PostType

interface ArticleCardProps {
  article: PostType;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <div className="rounded-lg overflow-hidden flex flex-col bg-[#1a2233] border border-gray-700 shadow-lg h-full">
      <div className="relative w-full aspect-w-4 aspect-h-3">
        <img
          src={article.images?.[0] || '/assets/images/default-post.jpg'}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute left-0 bg-secondaryColor text-black text-xs font-bold flex items-center justify-center top-2 w-[100px] h-[25px] rounded-r-md">
          {new Date(article.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <p className="text-sm mb-2">
          Đăng bởi: <span className="text-secondaryColor">{article.user_id.username}</span> In: <span className="text-secondaryColor">{article.categories_id.Cate_name}</span>
        </p>
        <h3 className="text-xl font-bold mb-2 break-words leading-tight">
          {article.title}
        </h3>
        <p className="text-sm text-gray-300 mb-4 flex-grow overflow-hidden text-ellipsis line-clamp-3">
          {article.desc}
        </p>
        <div className="mt-auto">
          <ButtonComponents  variant="filled" size="small" onClick={() => window.location.href = `/post-details/${article._id}`}>
            ĐỌC THÊM
          </ButtonComponents>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
