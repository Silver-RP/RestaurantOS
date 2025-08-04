import React, { useState, useCallback } from 'react';
import { FaAnglesRight } from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';
import ButtonComponents from '../components/common/ButtonComponents';

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

  // Reset expanded questions when changing category
  const handleCategoryChange = useCallback((category: keyof typeof faqData) => {
    setActiveCategory(category);
    setExpandedQuestions({}); // Reset all expanded questions
  }, []);

  const toggleAnswer = useCallback((index: string | number) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  const answerVariants = {
    hidden: {
      opacity: 0,
      scaleY: 0,
      transformOrigin: 'top',
    },
    visible: {
      opacity: 1,
      scaleY: 1,
      transformOrigin: 'top',
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      scaleY: 0,
      transformOrigin: 'top',
      transition: {
        duration: 0.15,
        ease: 'easeIn',
      },
    },
  };

  return (
    <div className="min-h-screen bg-bodyBackground">
      <div className="min-h-auto bg-bodyBackground py-16 flex justify-center">
        <div className="w-11/12 md:w-container95 lg:w-container95 xl:w-container95 2xl:w-mainContainer mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Category Sidebar */}
              <motion.div className="w-full lg:w-1/4" variants={itemVariants}>
                <div className="sticky top-8">
                  <h3 className="text-2xl font-restora font-light text-white mb-6">
                    Danh mục
                  </h3>
                  <div className="flex flex-col gap-3">
                    {Object.keys(faqData).map((key) => (
                      <motion.div
                        key={key}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ButtonComponents
                          variant={
                            activeCategory === key ? 'selected' : 'filled'
                          }
                          size="medium"
                          onClick={() =>
                            handleCategoryChange(key as keyof typeof faqData)
                          }
                          className="w-full text-left justify-start"
                        >
                          <span className="font-roboto">
                            {faqCategories[key as keyof typeof faqCategories] ||
                              key}
                          </span>
                        </ButtonComponents>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* FAQ Content */}
              <motion.div
                className="w-full lg:w-3/4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-restora font-light text-white mb-2">
                    {faqCategories[activeCategory]}
                  </h2>
                  <p className="text-grayText font-roboto">
                    Tìm hiểu thêm về{' '}
                    {faqCategories[activeCategory].toLowerCase()}
                  </p>
                </div>

                <motion.div
                  className="space-y-4"
                  key={activeCategory}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {faqData[activeCategory]?.map((faq, index) => (
                    <motion.div
                      key={`${activeCategory}-${index}`}
                      className="bg-headerBackground border border-hr rounded-lg overflow-hidden shadow-md"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      whileHover={{ y: -1 }}
                    >
                      <button
                        onClick={() => toggleAnswer(index)}
                        className="w-full text-left px-6 py-5 bg-headerBackground hover:bg-opacity-80 transition-all duration-300 flex justify-between items-center group"
                      >
                        <h3 className="text-lg font-medium text-white font-roboto pr-4 group-hover:text-secondaryColor transition-colors duration-300">
                          {faq.question}
                        </h3>
                        <motion.div
                          animate={{
                            rotate: expandedQuestions[index] ? 90 : 0,
                          }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className="text-secondaryColor text-xl flex-shrink-0"
                        >
                          <FaAnglesRight />
                        </motion.div>
                      </button>

                      <AnimatePresence mode="wait">
                        {expandedQuestions[index] && (
                          <motion.div
                            variants={answerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="px-6 pb-5 overflow-hidden"
                          >
                            <div className="border-l-4 border-secondaryColor pl-4">
                              <p className="text-grayText font-roboto leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
