import { useMediaQuery } from 'react-responsive';
import ArticleCard from './PostComponent';
import { FaDiamond } from 'react-icons/fa6';
import ButtonComponents from '../../../common/ButtonComponents';
import React from 'react';
import { usePosts } from '../../../../hooks/usePosts';

const Postcomponent = () => {
  const isMobileOrTablet = useMediaQuery({ maxWidth: 1024 });
  const { data: postsData, isLoading, error } = usePosts({ limit: 3, sortBy: 'createdAt', sortOrder: 'desc', status: 'published' });

  if (isLoading) {
    return <div className="text-white text-center">Đang tải bài viết...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">Lỗi khi tải bài viết: {error.message}</div>;
  }

  const articlesToDisplay = postsData?.docs || [];

  return (
    <div className="bg-[#012B40] text-white py-10 h-auto flex flex-col justify-center items-center">
      <div className="w-11/12 md:w-container95 lg:w-mainContainer xl:w-container95 2xl:w-mainContainer  mx-auto">
        <div className="text-center mb-10">
          <img
            src="/assets/images/News.svg"
            alt="News Icon"
            className="mx-auto mb-4 w-12 h-12"
          />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-restora font-thin mb-4">
            Tin Tức & Sự Kiện
          </h2>
          <h2 className="text-xs sm:text-sm md:text-base flex justify-center items-center  font-sans font-extralight uppercase tracking-widest mb-6 text-secondaryColor">
            <FaDiamond className="inline mr-2" style={{ fontSize: '7px' }} />
            Đặc biệt hôm nay
            <FaDiamond className="inline ml-2" style={{ fontSize: '7px' }} />
          </h2>
        </div>

        {isMobileOrTablet ? (
          <div className="w-full flex overflow-x-auto space-x-4 snap-x snap-mandatory">
            {articlesToDisplay.map((article, index) => (
              <div
                key={article._id}
                className="flex-none w-[90%] max-w-[330px] h-[477px] bg-[#012B40] rounded-lg shadow-none snap-center"
              >
                <div className="relative w-full h-[200px]">
                  <img
                    src={article.images?.[0] || '/assets/images/default-post.jpg'}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute left-0 bg-[#FFDEA0] text-black text-xs font-bold flex items-center justify-center top-2 w-[100px] h-[25px]">
                    {new Date(article.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>
                <div className="p-4 flex-grow flex flex-col mt-4 h-[277px]">
                  <h3 className="text-lg font-bold mb-2 text-left text-16">
                    {article.title}
                  </h3>
                  <p className="text-sm text-[#FFDEA0] mb-4 text-left text-[10px]">
                    {article.categories_id.Cate_name}
                  </p>
                  <p className="text-sm mb-4 flex-grow text-left text-[10px]">
                    {article.desc}
                  </p>
                  <div className="mt-auto">
                    <ButtonComponents variant="filled" size="small" onClick={() => window.location.href = `/post-details/${article._id}`}>
                      ĐỌC THÊM
                    </ButtonComponents>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {articlesToDisplay.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Postcomponent;
