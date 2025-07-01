import React from 'react';
import { useNavigate } from 'react-router-dom';
interface FeatureItemProps {
  title: string;
  subtitle: string;
  buttonText?: string;
  backgroundImage: string;
  link: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({
  title,
  subtitle,
  buttonText = 'KHÁM PHÁ',
  backgroundImage,
  link
}) => {
  const navigate = useNavigate();
  return (
    <div
      className="relative bg-cover bg-center group h-full"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-10"></div>
      {/* Overlay với hiệu ứng hover */}
      <div className="absolute inset-0 bg-headerBackground group-hover:bg-opacity-70 transition-all duration-500 ease-in-out transform scale-y-0 group-hover:scale-y-100 origin-bottom"></div>

      {/* Nội dung */}
      <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white text-left px-4 py-6">
        <h2 className="text-lg md:text-2xl lg:text-3xl font-restora font-thin transition-all duration-500 ease-in-out transform lg:translate-y-10 lg:group-hover:translate-y-0">
          {title}
        </h2>
        <p className="text-xs md:text-sm mt-2 uppercase tracking-wide text-secondaryColor font-thin transition-all duration-500 ease-in-out transform lg:translate-y-10 lg:group-hover:translate-y-0">
          {subtitle}
        </p>
        {buttonText && (
          <button
            onClick={() => navigate(link)}
            className="font-semibold font-sans text-xs mt-6 px-6 md:px-8 py-2 md:py-3 border border-secondaryColor hover:bg-secondaryColor hover:text-black opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transform translate-y-0 lg:translate-y-10 lg:group-hover:translate-y-0 transition-all duration-500 ease-in-out"
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

const FeatureSection: React.FC = () => {
  const features = [
    {
      title: 'Thưởng thức đồ uống',
      subtitle: 'Bộ sưu tập rượu vang',
      backgroundImage: '/assets/images/home/discover1.jpg',
      link: '/menu?category=do-uong-co-con',
    },
    {
      title: 'Tinh hoa ẩm thực từ đầu bếp',
      subtitle: 'Công thức đặc biệt',
      backgroundImage: '/assets/images/home/discover2.jpg',
      link: '/menu?category=mon-chinh',
    },
    {
      title: 'Thực đơn đề xuất',
      subtitle: 'Món ăn đề xuất',
      backgroundImage: '/assets/images/home/discover3.jpg',
      link: '/menu?sort=recommendDishes',
    },
  ];

  return (
    <section className="relative">
      {/* Hiển thị grid trên màn hình lớn */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-0">
        {features.map((feature, index) => (
          <div key={index} className="h-[300px] md:h-[600px]">
            <FeatureItem
              title={feature.title}
              subtitle={feature.subtitle}
              backgroundImage={feature.backgroundImage}
              link={feature.link}
            />
          </div>
        ))}
      </div>

      {/* Hiển thị carousel trên màn hình nhỏ */}
      <div className="flex lg:hidden overflow-x-auto snap-x snap-mandatory gap-0">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[100%] sm:w-[50%] h-[600px] md:h-[600px] snap-center group"
          >
            <FeatureItem
              title={feature.title}
              subtitle={feature.subtitle}
              backgroundImage={feature.backgroundImage}
              link={feature.link}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
