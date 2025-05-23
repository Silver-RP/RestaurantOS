import React, { useState } from 'react';
import { FaAnglesRight, FaAnglesDown } from 'react-icons/fa6';

const faqData = {
  tong_quat: [
    {
      question: 'Chính sách hoàn tiền là gì?',
      answer:
        'Chúng tôi áp dụng chính sách hoàn tiền trong vòng 30 ngày kể từ ngày mua hàng. Nếu bạn không hài lòng với đơn hàng, bạn có thể hoàn trả để được hoàn tiền hoặc đổi món khác. Vui lòng đảm bảo món ăn còn nguyên vẹn và chưa qua sử dụng.',
    },
    {
      question: 'Làm thế nào để theo dõi đơn hàng?',
      answer:
        'Để theo dõi đơn hàng, hãy truy cập mục "Lịch sử đơn hàng" trong trang tài khoản của bạn. Tại đây, bạn sẽ thấy trạng thái và thông tin giao hàng của đơn hàng.',
    },
    {
      question: 'Làm sao để liên hệ bộ phận chăm sóc khách hàng?',
      answer:
        'Bạn có thể gọi đến đường dây nóng của chúng tôi qua số 1-800-123-4567 (hoạt động 24/7), trò chuyện trực tuyến trên website hoặc gửi email đến support@yourcompany.com.',
    },
    {
      question: 'Nhà hàng có hỗ trợ đặt bàn trước không?',
      answer:
        'Có. Bạn có thể đặt bàn trực tuyến thông qua website hoặc gọi điện trực tiếp đến nhà hàng. Chúng tôi khuyến khích đặt trước để đảm bảo có bàn vào giờ cao điểm.',
    },
    {
      question: 'Thời gian mở cửa của nhà hàng như thế nào?',
      answer:
        'Nhà hàng mở cửa từ 10:00 sáng đến 10:00 tối mỗi ngày, bao gồm cả cuối tuần và ngày lễ.',
    },
    {
      question: 'Nhà hàng có phục vụ món chay không?',
      answer:
        'Có. Chúng tôi có thực đơn riêng dành cho khách hàng ăn chay, bao gồm các món khai vị, món chính và tráng miệng.',
    },
  ],
  tai_khoan: [
    {
      question: 'Làm sao để đổi mật khẩu?',
      answer:
        'Để đổi mật khẩu, hãy vào mục "Cài đặt tài khoản" trong trang cá nhân, sau đó chọn "Đổi mật khẩu" và làm theo hướng dẫn.',
    },
    {
      question: 'Làm sao để khôi phục mật khẩu khi quên?',
      answer:
        'Hãy vào trang "Quên mật khẩu", nhập email của bạn và làm theo hướng dẫn trong email để tạo mật khẩu mới.',
    },
    {
      question: 'Làm sao để chỉnh sửa thông tin cá nhân?',
      answer:
        'Đăng nhập vào tài khoản, chọn "Thông tin cá nhân" và cập nhật các trường thông tin mong muốn như họ tên, số điện thoại, địa chỉ,...',
    },
  ],
  dat_ban: [
    {
      question: 'Tôi có thể đặt bàn cho bao nhiêu người?',
      answer:
        'Bạn có thể đặt bàn cho nhóm từ 1 đến 20 người. Với đoàn lớn hơn, vui lòng gọi trực tiếp để được hỗ trợ sắp xếp chỗ ngồi.',
    },
    {
      question: 'Có mất phí khi đặt bàn trước không?',
      answer:
        'Việc đặt bàn trước là hoàn toàn miễn phí. Tuy nhiên, nếu bạn không đến sau 15 phút kể từ giờ hẹn, chúng tôi sẽ ưu tiên cho khách khác.',
    },
    {
      question: 'Có thể chọn chỗ ngồi khi đặt bàn không?',
      answer:
        'Bạn có thể ghi chú yêu cầu về chỗ ngồi (ví dụ: gần cửa sổ, trong phòng riêng...). Chúng tôi sẽ cố gắng đáp ứng theo tình trạng chỗ trống.',
    },
  ],
  giao_hang: [
    {
      question: 'Những khu vực nào được hỗ trợ giao hàng?',
      answer:
        'Hiện tại, chúng tôi hỗ trợ giao hàng trong nội thành thành phố. Bạn có thể nhập địa chỉ khi đặt món để kiểm tra khu vực hỗ trợ.',
    },
    {
      question: 'Phí giao hàng được tính như thế nào?',
      answer:
        'Phí giao hàng dao động từ 20.000đ đến 40.000đ tùy khu vực. Miễn phí giao hàng cho đơn hàng từ 500.000đ trở lên.',
    },
    {
      question: 'Tôi có thể đặt món giao tận nơi vào khung giờ nào?',
      answer:
        'Bạn có thể đặt món từ 10:30 sáng đến 9:30 tối. Chúng tôi sẽ giao trong vòng 30–60 phút tùy khoảng cách và số lượng đơn hàng.',
    },
    {
      question: 'Tôi có thể huỷ đơn hàng sau khi đã đặt không?',
      answer:
        'Bạn có thể huỷ đơn hàng trong vòng 5 phút sau khi đặt. Sau thời gian đó, đơn sẽ được chuyển đến bếp và không thể huỷ.',
    },
  ],
};

const faqCategories = {
  tong_quat: 'Tổng quát',
  tai_khoan: 'Tài khoản',
  dat_ban: 'Đặt bàn',
  giao_hang: 'Giao hàng',
};

export default function FaqPage() {
  const [expandedQuestions, setExpandedQuestions] = useState<{
    [key: string]: boolean;
  }>({});
  const [activeCategory, setActiveCategory] =
    useState<keyof typeof faqData>('tong_quat');

  const toggleAnswer = (index: string | number) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="min-h-screen bg-bodyBackground">
      <div
        className="bg-cover bg-center h-60 flex items-center justify-center"
        style={{ backgroundImage: "url('/images/banner/FAQs-banner-1.jpg')" }}
      >
        <div className="text-center">
          <h1 className="text-white text-4xl font-bold mb-2">FAQs</h1>
          <p className="text-white text-lg opacity-80">
            Những câu hỏi thường gặp
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Category Buttons */}
          <div className="w-full md:w-1/4">
            <div className="flex flex-col gap-4 ml-10">
              {Object.keys(faqData).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key as keyof typeof faqData)}
                  className={`text-left px-4 py-2 rounded-md text-lg font-medium border transition-all
                    ${
                        activeCategory === key
                        ? 'bg-headerBackground text-white'
                        : 'bg-gray-100 text-headerBackground hover:bg-headerBackground hover:text-white'
                    }`}
                >
                  {faqCategories[key as keyof typeof faqCategories] || key}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Content */}
          <div className="w-full md:w-3/4">
            <div className="flex flex-col gap-4">
              {faqData[activeCategory]?.map((faq, index) => (
                <div key={index}>
                  <button
                    onClick={() => toggleAnswer(index)}
                    className="w-full text-black flex justify-between items-center px-4 py-3 bg-white border rounded-lg text-left text-md font-medium hover:bg-gray-100 transition"
                  >
                    {faq.question}
                    {expandedQuestions[index] ? (
                      <FaAnglesDown />
                    ) : (
                      <FaAnglesRight />
                    )}
                  </button>
                  {expandedQuestions[index] && (
                    <p className="bg-white px-6 py-4 border-l-4 border-orange-500 text-gray-700 rounded-b-lg">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
