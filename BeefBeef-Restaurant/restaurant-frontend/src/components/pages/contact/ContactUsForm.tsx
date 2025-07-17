import { FiChevronDown } from 'react-icons/fi';
import ButtonComponents from '../../common/ButtonComponents';
import React, { useState } from 'react';

const ContactUsForm: React.FC = () => {
  const [formData, setFormData] = useState({
    subject: '',
    email: '',
    message: '',
    name: '',
    file: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dữ liệu gửi đi:', formData);
  };

  return (
    <div className="min-h-auto bg-bodyBackground py-16 flex justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-10 w-11/12 md:w-container95 lg:w-container95 xl:w-container95 2xl:w-mainContainer  mx-auto">
        <div className=" rounded-md col-span-4 text-white">
          <h2 className="text-2xl mb-6">Liên hệ với chúng tôi</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 relative">
  <label className="text-sm md:text-base">Chủ đề</label>
  <div className="relative">
    <select
      name="subject"
      className="p-3 pr-10 bg-transparent border border-[#074b6b] text-white placeholder:text-gray-400 
        rounded appearance-none focus:outline-none focus:border-secondaryColor focus:ring-1 focus:ring-secondaryColor transition w-full"
      value={formData.subject}
      onChange={handleChange}
    >
      <option value="">-- Chọn chủ đề --</option>
      <option value="Dịch vụ khách hàng">Dịch vụ khách hàng</option>
      <option value="Hỗ trợ kỹ thuật">Hỗ trợ kỹ thuật</option>
      <option value="Góp ý">Góp ý</option>
    </select>
    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none" />
  </div>
</div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-col gap-2 w-full md:w-1/2">
                <label className="text-sm md:text-base">Tên</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Tên của bạn"
                  className="p-3 bg-transparent border border-[#074b6b] text-white placeholder:text-gray-400 
        rounded focus:outline-none focus:border-secondaryColor focus:ring-1 focus:ring-secondaryColor transition"
                  value={formData.name || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-2 w-full md:w-1/2">
                <label className="text-sm md:text-base">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="ban@email.com"
                  className="p-3 bg-transparent border border-[#074b6b] text-white placeholder:text-gray-400 
        rounded focus:outline-none focus:border-secondaryColor focus:ring-1 focus:ring-secondaryColor transition"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm md:text-base">Tệp đính kèm</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="text-white file:bg-[#ffda95] file:border-0 file:text-black file:px-3 file:py-1"
              />
              <span className="text-sm text-gray-400">(không bắt buộc)</span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm md:text-base">Tin nhắn</label>
              <textarea
                name="message"
                rows={6}
                placeholder="Chúng tôi có thể giúp gì cho bạn?"
                className="p-3 bg-transparent border border-[#074b6b] text-white placeholder:text-gray-400 
    rounded focus:outline-none focus:border-secondaryColor focus:ring-1 focus:ring-secondaryColor transition"
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            <div className="text-right">
              <ButtonComponents
                type="submit"
                variant="outline"
                size="small"
                className="px-8"
              >
                Gửi
              </ButtonComponents>
            </div>
          </form>
        </div>

        <div className="hidden lg:block rounded-md col-span-3 overflow-hidden shadow-md">
          <img
            src="/assets/images/contact_img-1.jpg"
            alt="Contact Illustration"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactUsForm;
