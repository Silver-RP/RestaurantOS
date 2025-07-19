
import React, { useState } from "react";
import { FaFacebookF, FaInstagram, FaPhoneAlt, FaMapMarkerAlt, FaEnvelope, FaTwitter, FaYoutube, FaPinterestP } from "react-icons/fa";
import { Link } from "react-router-dom";

const MobileFooter = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <footer className="bg-black text-white py-8 px-4">
      <div className="flex justify-center mb-6 overflow-hidden h-[80px]">
        <img
          src="/assets/images/logo.png"
          alt="BeefBeef Logo"
          width={160}
          height={100}
          className="object-contain"
        />
      </div>

      <div>
        {[
          {
            title: "Về Nhà Hàng",
            content: (
              <p className="text-sm leading-relaxed">
                BeefBeef là nhà hàng chuyên phục vụ các món bò chất lượng cao trong không gian sang trọng và thân thiện. Chúng tôi luôn cam kết mang đến trải nghiệm ẩm thực tốt nhất cho khách hàng.
              </p>
            ),
          },
          {
            title: "Thời Gian Mở Cửa",
            content: (
              <ul className="text-sm space-y-1">
                <li>T2 - T6: 8:00 AM - 10:00 PM</li>
                <li>T7 - CN: 8:00 AM - 11:00 PM</li>
              </ul>
            ),
          },
          {
            title: "Hỗ Trợ Khách Hàng",
            content: (
              <ul className="text-sm space-y-1">
                <li><Link to={""} className="hover:text-secondaryColor">Câu hỏi thường gặp</Link></li>
                <li><Link to={""} className="hover:text-secondaryColor">Hỗ trợ đặt bàn</Link></li>
                <li><Link to={""} className="hover:text-secondaryColor">Chính sách giao hàng</Link></li>
                <li><Link to={""} className="hover:text-secondaryColor">Điều khoản & điều kiện</Link></li>
                <li><Link to={""} className="hover:text-secondaryColor">Khiếu nại & góp ý</Link></li>
                <li><Link to="/reservation/lookup-reservation" className="text-sm hover:text-secondaryColor transition">Tra cứu đơn đặt bàn</Link></li>
              </ul>
            ),
          },
          {
            title: "Liên Hệ",
            content: (
              <div className="text-xs space-y-1">
                <p><FaPhoneAlt className="inline mr-2" /> +84 - 05512345, +84 - 0239991256</p>
                <p><FaEnvelope className="inline mr-2" /> beefbeef@gmail.com</p>
                <p><FaMapMarkerAlt className="inline mr-2" /> 161 Quốc Hương, Thảo Điền, Quận 2</p>
              </div>
            ),
          },
        ].map((section) => (
          <div key={section.title} className="border-b border-gray-700 py-3">
            <button
              className="flex justify-between w-full text-left font-semibold text-sm items-center"
              onClick={() => toggleSection(section.title)}
            >
              <span>{section.title}</span>
              <div
                className={`text-3xl flex items-center justify-center w-8 h-8 transition-transform transform ${
                  activeSection === section.title ? "rotate-180" : "rotate-0"
                }`}
              >
                {activeSection === section.title ? "−" : "+"}
              </div>
            </button>
            <div
              className={`overflow-hidden transition-all duration-700 ease-in-out ${
                activeSection === section.title
                  ? "opacity-100 max-h-[500px] translate-y-0"
                  : "opacity-0 max-h-0 -translate-y-4"
              }`}
            >
              <div className="mt-2 text-sm py-2">{section.content}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center text-xs text-white">
  <div className="flex justify-center items-center mb-2 gap-4">
  <a href="#" className="text-gray-400 hover:text-secondaryColor">
        <FaFacebookF />
      </a>
      <a href="#" className="text-gray-400 hover:text-secondaryColor">
        <FaTwitter />
      </a>
      <a href="#" className="text-gray-400 hover:text-secondaryColor">
        <FaYoutube />
      </a>
      <a href="#" className="text-gray-400 hover:text-secondaryColor">
        <FaPinterestP />
      </a>
      <a href="#" className="text-gray-400 hover:text-secondaryColor">
        <FaInstagram />
      </a>
  </div>
  <p className="text-sm">© {new Date().getFullYear()} BeefBeef. Tất cả quyền được bảo lưu.</p>
</div>
    </footer>
  );
};

export default MobileFooter;