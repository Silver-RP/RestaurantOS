import React from 'react';
import ButtonComponents from '../../../common/ButtonComponents';
import { useNavigate } from 'react-router-dom';

const Experience = () => {
  const navigate = useNavigate();

  const handleReservationClick = () => {
    navigate('/reservation');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#012B40] via-[#0a3d5a] to-[#012B40] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Section - Content */}
          <div className="space-y-8">
            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-restora font-light leading-tight text-white">
                Nơi Hoàn Hảo Cho Một{' '}
                <span className="text-secondaryColor font-medium">
                  Trải Nghiệm Tuyệt Vời
                </span>
              </h1>

              {/* Decorative line */}
              <div className="w-24 h-1 bg-secondaryColor rounded-full"></div>
            </div>

            {/* Description */}
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p className="text-lg">
                Ban ngày, Beef Beef cung cấp một nơi gặp gỡ bạn bè và đồng
                nghiệp với các loại rượu vang được lựa chọn kỹ càng, dịch vụ tận
                tâm nhưng chuyên nghiệp và thực đơn phức tạp, tất cả đều được
                cung cấp trong một khung cảnh thoải mái.
              </p>
              <p className="text-lg">
                Vào ban đêm, khung cảnh được thiết lập cho mọi dịp. Từ bàn thân
                mật dành cho hai người đến nhóm nhỏ hoặc các sự kiện riêng tư
                lớn hơn. Sự thú vị tuyệt vời của chúng tôi đến từng chi tiết và
                sự tập trung mạnh mẽ vào việc cung cấp trải nghiệm ẩm thực tốt
                nhất được thiết kế vượt trên cả mong đợi.
              </p>
            </div>

            {/* Contact Section */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="text-center space-y-4">
                <p className="text-gray-300 text-sm uppercase tracking-wider">
                  Liên hệ đặt bàn
                </p>
                <p className="text-3xl lg:text-4xl text-secondaryColor font-semibold">
                  +84-0239991255
                </p>
                <ButtonComponents
                  variant="filled"
                  size="large"
                  className="mt-6 w-full sm:w-auto px-8 py-4 text-lg font-medium"
                  onClick={handleReservationClick}
                >
                  Đặt bàn tại đây
                </ButtonComponents>
              </div>
            </div>
          </div>

          {/* Right Section - Images */}
          <div className="space-y-8">
            {/* Main Image */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-secondaryColor/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img
                src="/assets/images/AboutUs/people.svg"
                alt="Dining Experience"
                className="relative w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-2xl transform group-hover:scale-102 transition-transform duration-300"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
            </div>

            {/* Food Image */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-secondaryColor/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img
                src="/assets/images/AboutUs/Beefsteak.svg"
                alt="Signature Dish"
                className="relative w-full h-64 lg:h-80 object-cover rounded-2xl shadow-2xl transform group-hover:scale-102 transition-transform duration-300"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>

              {/* Floating badge */}
              <div className="absolute top-4 right-4 bg-secondaryColor text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                Món đặc biệt
              </div>
            </div>
          </div>
        </div>

        {/* Bottom decorative element */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-4 text-gray-400">
            <div className="w-8 h-px bg-gray-400"></div>
            <span className="text-sm uppercase tracking-wider">
              Beef Beef Restaurant & Bar
            </span>
            <div className="w-8 h-px bg-gray-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;
