import React from 'react';
import { PiWineThin } from 'react-icons/pi';
import { GiNoodles } from 'react-icons/gi';
import { BsCalendarEventFill } from 'react-icons/bs';
import ButtonComponents from './ButtonComponents';
import ShowcaseSectionMobile from './ShowcaseSectionMobile';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';

const items = [
  {
    type: 'icon',
    title: 'Danh sách rượu',
    subtitle: 'TUYỂN CHỌN',
    description: 'Rượu "On-Tap" & Chai đóng sẵn',
    icon: (
      <PiWineThin className="text-5xl text-secondaryColor font-light mb-4" />
    ),
    link: '/menu?category=do-uong-co-con',
  },
  {
    type: 'image',
    src: '/assets/images/banner/reservation01.jpg',
    alt: 'Món khai vị',
  },
  {
    type: 'icon',
    title: 'Khai vị',
    subtitle: 'TUYỂN CHỌN',
    description: 'Món ăn chia sẻ & Bánh mì dẹt',
    icon: (
      <GiNoodles className="text-5xl text-secondaryColor font-light mb-4" />
    ),
    link: '/menu?category=mon-khai-vi',
  },
  {
    type: 'image',
    src: '/assets/images/banner/reservation2.jpg',
    alt: 'Phòng ăn',
  },
  {
    type: 'icon',
    title: 'Sắp diễn ra',
    subtitle: 'SỰ KIỆN',
    description: 'Sự kiện nếm rượu sắp tới',
    icon: (
      <BsCalendarEventFill className="text-5xl text-secondaryColor font-light mb-4" />
    ),
    link: '/posts',
  },
  {
    type: 'image',
    src: '/assets/images/banner/reservation03.jpg',
    alt: 'Thịt bò nướng',
  },
];

const ShowcaseSection: React.FC = () => {
  const navigate = useNavigate();
  const pairedItems = [];
  for (let i = 0; i < items.length; i += 2) {
    pairedItems.push([items[i], items[i + 1]]);
  }
  const isMobileOrTablet = useMediaQuery({ maxWidth: 1024 });

  if (isMobileOrTablet) return <ShowcaseSectionMobile />;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 w-full py-10 bg-bodyBackground">
      {pairedItems.map((pair, index) => {
        const isReversed = index % 2 === 1;
        return (
          <div
            key={index}
            className="group shadow-md overflow-hidden h-[520px] flex flex-col transition-all duration-500"
          >
            <div
              className={`bg-[#0a2738] text-white p-6 transition-all duration-500 overflow-hidden ${
                isReversed ? 'order-last' : 'order-first'
              } group-hover:h-[55%] h-[220px] flex flex-col justify-center`}
            >
              <div className="transition-all duration-500 text-left space-y-2">
                {pair[0].icon}
                <h3 className="text-xl">{pair[0].title}</h3>
                <p className="text-xs text-secondaryColor tracking-widest uppercase">
                  {pair[0].subtitle}
                </p>
                <p className="text-sm text-gray-300 group-hover:text-white transition-colors duration-300">
                  {pair[0].description}
                </p>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {pair[0].link && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <ButtonComponents
                        variant="filled"
                        size="small"
                        className="uppercase tracking-widest mt-2"
                        onClick={() => navigate(pair[0].link!)}
                      >
                        Khám phá ngay
                      </ButtonComponents>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              className={`overflow-hidden transition-all duration-500 ${
                isReversed ? 'order-first' : 'order-last'
              } group-hover:h-[45%] h-[300px]`}
            >
              <img
                src={pair[1].src}
                alt={pair[1].alt}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ShowcaseSection;
