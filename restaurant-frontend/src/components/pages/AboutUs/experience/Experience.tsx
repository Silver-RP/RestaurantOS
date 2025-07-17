import React from 'react';
import ButtonComponents from '../../../common/ButtonComponents';
import { useNavigate } from 'react-router-dom';

const Experience = () => {
  const navigate = useNavigate();

  const handleReservationClick = () => {
    navigate('/reservation');
  };

  return (
    <div className="flex justify-center items-center bg-[#012B40]">
      <div className="text-white px-8 sm:grid=col  w-mainContainer sm:w-container95">
        <div className="grid grid-cols-1 sm:py-10 sm:grid-cols-2  gap-8 items-start sm:mt-6 lg:mt-0">
          {/* box left */}
          <div>
            <h1 className="text-3xl sm:text-4xl leading-tight mb-6 font-restora ">
              Nơi Hoàn Hảo Cho Một Trải Nghiệm Tuyệt Vời
            </h1>

            <div>
              <img
                src="/assets/images/AboutUs/people.svg"
                alt="Dining Experience"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* box right */}
          <div className="grid  gap-6">
            {/* Description Div */}
            <div className="text-gray-300 text-[11px] leading-6 mb-6">
              <p className="mb-2">
                Ban ngày, Delicioz cung cấp một nơi gặp gỡ bạn bè và đồng nghiệp
                với các loại rượu vang được lựa chọn kỹ càng, dịch vụ kĩ càng
                đào nhưng chuyên nghiệp và thực đơn phức tạp, tất cả đều được
                cung cấp trong một khung cảnh thoải mái.
              </p>
              <p>
                Vào ban đêm, khung cảnh được thiết lập cho mọi dịp. Từ bàn thân
                mật dành cho hai người đến nhóm nhỏ hoặc các sự kiện riêng tư
                lớn hơn. Sự thú vị tuyệt vời của chúng tôi đến từng chi tiết và
                sự tập trung mạnh mẽ vào việc cung cấp trải nghiệm ẩm thực tốt
                nhất được thiết kế vượt trên cả mong đợi.
              </p>

              <div className="mt-14">
                <img
                  src="/assets/images/AboutUs/Beefsteak.svg"
                  alt="Dish"
                  className="w-full rounded-lg shadow-lg"
                />
                <div className="text-center space-y-4">
                  <p className="text-[12px]">Liên hệ đặt bàn</p>
                  <p className="text-[24px] text-secondaryColor font-semibold">
                    +39-055-123456
                  </p>
                  <ButtonComponents
                    variant="filled"
                    size="medium"
                    className="mt-4"
                    onClick={handleReservationClick}
                  >
                    Đặt bàn tại đây
                  </ButtonComponents>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;
