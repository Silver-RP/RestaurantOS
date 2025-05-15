import React from 'react';
import { useMediaQuery } from 'react-responsive';
import ButtonComponents from './ButtonComponents';
import { useNavigate } from 'react-router-dom';

const items = [
    {
      type: 'icon',
      title: 'Danh sách rượu',
      subtitle: 'TUYỂN CHỌN',
      description: 'Rượu "On-Tap" & Chai đóng sẵn',
      icon: '/assets/images/banner/reservation01.jpg',
      link: '/menu?category=do-uong-co-con',
    },
    {
      type: 'icon',
      title: 'Khai vị',
      subtitle: 'TUYỂN CHỌN',
      description: 'Món ăn chia sẻ & Bánh mì dẹt',
      icon: '/assets/images/banner/reservation2.jpg',
      link: '/menu?category=mon-khai-vi',
    },
    {
      type: 'icon',
      title: 'Sắp diễn ra',
      subtitle: 'SỰ KIỆN',
      description: 'Sự kiện nếm rượu sắp tới',
      icon: '/assets/images/banner/reservation03.jpg',
      link: '/posts',
    },
  ];

const ShowcaseSectionMobile: React.FC = () => {
  const isMobileOrTablet = useMediaQuery({ maxWidth: 1024 });
  const navigate = useNavigate();
  if (!isMobileOrTablet) return null;

  return (
    <div className="w-full bg-bodyBackground py-8 px-4 overflow-x-auto snap-x snap-mandatory flex space-x-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex-none snap-center bg-[#0a2738] text-white w-[85%] max-w-[320px] rounded-lg overflow-hidden shadow-md"
        >
          <div className="h-[180px] w-full">
            <img
              src={item.icon}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 flex flex-col justify-between h-[220px]">
            <div>
              <h3 className="text-xl mb-1">{item.title}</h3>
              <p className="text-xs text-secondaryColor uppercase tracking-widest mb-2">
                {item.subtitle}
              </p>
              <p className="text-sm text-gray-300">{item.description}</p>
            </div>
            <ButtonComponents
  variant="filled"
  size="small"
  className="uppercase tracking-widest mt-4"
  onClick={() => navigate(item.link)}
>
  Khám phá ngay
</ButtonComponents>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShowcaseSectionMobile;