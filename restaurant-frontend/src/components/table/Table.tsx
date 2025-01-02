import React from "react";
import background from "../../assets/Baccont.png"; // Import ảnh nền
import icon from "../../assets/Icon.png"; // Import ảnh icon
import { GoDotFill } from "react-icons/go";

function App() {
  return (
    <div
      className="relative mx-auto bg-cover bg-center h-[250px] sm:h-[300px] md:h-[365.42px]"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Overlay màu đen mờ */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Nội dung chính */}
      <div className="relative flex items-center justify-center h-full text-white text-center px-4">
        <div>
          {/* Icon */}
          <img
            src={icon}
            alt="Icon"
            className="mx-auto mb-4 w-10 h-10 sm:w-12 sm:h-12"
          />

          {/* Tiêu đề */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal my-6 font-sans">
            Đặt Bàn
          </h1>

          {/* Phụ đề với biểu tượng chấm tròn */}
          <h2 className="text-xs sm:text-sm md:text-base font-semibold tracking-wider mb-6 text-secondaryColor">
            <GoDotFill className="inline text-lg sm:text-xl mr-2" /> {/* Dot bên trái */}
            BÀN ĂN CỦA BẠN
            <GoDotFill className="inline text-lg sm:text-xl ml-2" /> {/* Dot bên phải */}
          </h2>

          {/* Nội dung mô tả */}
          <p className="text-[10px] sm:text-xs md:text-sm max-w-xs sm:max-w-md mx-auto leading-relaxed">
            Tập trung vào việc kế thừa và chia sẻ ẩm thực Pháp, khôi phục hương vị của
            các nguyên liệu và khám phá tất cả các khả năng ẩm thực tuyệt vời.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
