import React from "react";
import { useMediaQuery } from "react-responsive"; 
import ArticleCard from "./PostComponent"; 
import { FaDiamond } from "react-icons/fa6";
import ButtonComponents from "../../../common/ButtonComponents";

const Postcomponent = () => {
  const isMobileOrTablet = useMediaQuery({ maxWidth: 1024 });

  const articles = [
    {
      date: "18 FEB 2022",
      title: "Cách chế biến beefsteak ngon miệng tại nhà",
      category: "Thực phẩm lành mạnh, tin tức",
      description:
        "Hãy giữ vị trí và thể hiện phong cách của bạn. Với các công thức nấu ăn, không gì có thể thỏa mãn hơn. Chúng tôi khuyến khích sức khỏe và hương vị đặc biệt.",
      image: "/assets/images/Post.jpg",
    },
    {
      date: "18 MAY 2022",
      title: "Xu hướng món ăn hiện đại ngày nay",
      category: "Thực phẩm lành mạnh, tin tức",
      description:
        "Mở rộng vị giác, khám phá phong cách hiện đại từ nhà hàng của chúng tôi. Mỗi hương vị đều chứa đựng sự sáng tạo độc đáo từ đầu bếp của chúng tôi.",
      image: "/assets/images/Post.jpg",
    },
    {
      date: "18 FEB 2022",
      title: "Cách thưởng thức món ăn tại nhà hàng của chúng tôi",
      category: "Thực phẩm lành mạnh, tin tức",
      description:
        "Tạo ra những khoảnh khắc tuyệt vời trong ẩm thực. Những món ăn từ nguyên liệu tự nhiên không chỉ tốt cho sức khỏe mà còn đầy thú vị.",
      image: "/assets/images/Post.jpg",
    },
  ];

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
          <FaDiamond className="inline mr-2" style={{ fontSize: "7px" }} /> 
          Đặc biệt hôm nay
          <FaDiamond className="inline ml-2" style={{ fontSize: "7px" }} />
        </h2>
      </div>

      {isMobileOrTablet ? (
    <div className="w-full flex overflow-x-auto space-x-4 snap-x snap-mandatory">
      {articles.map((article, index) => (
        <div
          key={index}
          className="flex-none w-[90%] max-w-[330px] h-[477px] bg-[#012B40] rounded-lg shadow-none snap-center"
        >
          <div className="relative w-full h-[200px]">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute left-0 bg-[#FFDEA0] text-black text-xs font-bold flex items-center justify-center top-2 w-[100px] h-[25px]">
              {article.date}
            </div>
          </div>
          <div className="p-4 flex-grow flex flex-col mt-4 h-[277px]">
            <h3 className="text-lg font-bold mb-2 text-left text-16">{article.title}</h3>
            <p className="text-sm text-[#FFDEA0] mb-4 text-left text-[10px]">{article.category}</p>
            <p className="text-sm mb-4 flex-grow text-left text-[10px]">{article.description}</p>
            <div className="mt-auto">
            <ButtonComponents variant="outline" size="small">
 ĐỌC THÊM
  </ButtonComponents>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="grid md:grid-cols-3 gap-6">
      {articles.map((article, index) => (
            <ArticleCard key={index} article={article} />
          ))}
    </div>
  )}
        </div>
    </div>
  );
};

export default Postcomponent;
