import ButtonComponents from "../../common/ButtonComponents";
import React, { useState } from "react";

const ContactUsForm: React.FC = () => {
  const [formData, setFormData] = useState({
    subject: "",
    email: "",
    message: "",
    file: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
    console.log("Dữ liệu gửi đi:", formData);
  };

  return (
    <div className="min-h-auto flex items-center justify-center bg-bodyBackground my-12 px-4 py-10">
      <div className="border border-hr rounded-md p-4 sm:p-6 md:p-10 w-full max-w-4xl text-white">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6">Liên hệ với chúng tôi</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Chủ đề */}
          <div className="flex flex-col lg:w-2/3 md:w-2/3 md:flex-row md:items-center gap-2 md:gap-4">
            <label className="md:w-32 text-sm md:text-base">Chủ đề</label>
            <select
              name="subject"
              className="flex-1 p-2 bg-white text-black rounded"
              value={formData.subject}
              onChange={handleChange}
            >
              <option value="">-- Chọn chủ đề --</option>
              <option value="Dịch vụ khách hàng">Dịch vụ khách hàng</option>
              <option value="Hỗ trợ kỹ thuật">Hỗ trợ kỹ thuật</option>
              <option value="Góp ý">Góp ý</option>
            </select>
          </div>

          {/* Email */}
          <div className="flex flex-col lg:w-2/3 md:w-2/3 md:flex-row md:items-center gap-2 md:gap-4">
            <label className="md:w-32 text-sm md:text-base">Email</label>
            <input
              type="email"
              name="email"
              placeholder="ban@email.com"
              className="flex-1 p-2 bg-transparent border border-hr text-white placeholder:text-gray-400 rounded"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* File đính kèm */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <label className="md:w-32 text-sm md:text-base">Tệp đính kèm</label>
            <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <input
                type="file"
                onChange={handleFileChange}
                className="text-white file:bg-[#ffda95] file:border-0 file:text-black file:px-3 file:py-1"
              />
              <span className="text-sm text-gray-400">(không bắt buộc)</span>
            </div>
          </div>

          {/* Tin nhắn */}
          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            <label className="md:w-32 text-sm md:text-base pt-2">Tin nhắn</label>
            <textarea
              name="message"
              rows={4}
              placeholder="Chúng tôi có thể giúp gì cho bạn?"
              className="flex-1 p-2 bg-transparent border border-[#074b6b] text-white placeholder:text-gray-400 rounded"
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          {/* Gửi */}
          <div className="text-center md:text-right mt-4">
            <ButtonComponents
              variant="outline"
              size="small"
              onClick={() => handleSubmit}
            >
              Gửi
            </ButtonComponents>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactUsForm;
