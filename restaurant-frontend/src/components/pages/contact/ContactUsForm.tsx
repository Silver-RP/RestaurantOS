import { FiChevronDown } from 'react-icons/fi';
import ButtonComponents from '../../common/ButtonComponents';
import React, { useState } from 'react';
import { useCreateContact } from '@/hooks/useContact';
import { ContactSchema } from '@/schemas/ContactSchemas';
import Cookies from 'js-cookie';
import { z } from 'zod';

const ContactUsForm: React.FC = () => {
  const [formData, setFormData] = useState({
    subject: '',
    email: '',
    message: '',
    name: '',
    phone: '',
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
        const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const errorMessage = validateFieldOnChange(name, value);
    setFormErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  const validateFieldOnChange = (name: string, value: string) => {
    try {
      const fieldSchema =
        ContactSchema.shape[name as keyof typeof ContactSchema.shape];
      fieldSchema.parse(value); 
      return ''; 
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.issues[0]?.message || 'Giá trị không hợp lệ';
      }
      return 'Giá trị không hợp lệ';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, file }));
  };

  const { mutate } = useCreateContact();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};
    const result = ContactSchema.safeParse(formData);
    if (!result.success) {
      result.error.errors.forEach((err) => {
        if (err.path[0]) errors[err.path[0]] = err.message;
      });
    }
    if (!checkIsLoggedIn()) {
      if (!formData.name || formData.name.trim() === '') {
        errors.name = 'Vui lòng nhập tên';
      }
      if (!formData.email || formData.email.trim() === '') {
        errors.email = 'Vui lòng nhập email';
      }
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    setIsLoading(true);
    try {
      await mutate(formData, {
        onSuccess: () => {
          setFormData({ subject: '', email: '', message: '', name: '', phone: '' });
          setFormErrors({});
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkIsLoggedIn = (): boolean => {
    const userInfo = Cookies.get('userInfo');
    return !!userInfo;
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
                  className={`p-3 pr-10 bg-transparent border ${formErrors.subject ? 'border-red-400' : 'border-[#074b6b]'} bg-bodyBackground text-white placeholder:text-gray-400 rounded appearance-none focus:outline-none focus:border-secondaryColor focus:ring-1 focus:ring-secondaryColor transition w-full`}
                  value={formData.subject}
                  onChange={handleChange}
                  title="Chủ đề liên hệ"
                >
                  <option className="text-white bg-bodyBackground" value="">
                    -- Chọn chủ đề --
                  </option>
                  <option
                    className="text-white bg-bodyBackground"
                    value="Dịch vụ khách hàng"
                  >
                    Dịch vụ khách hàng
                  </option>
                  <option
                    className="text-white bg-bodyBackground"
                    value="Hỗ trợ kỹ thuật"
                  >
                    Hỗ trợ kỹ thuật
                  </option>
                  <option
                    className="text-white bg-bodyBackground"
                    value="Góp ý"
                  >
                    Góp ý
                  </option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none" />
              </div>
              {formErrors.subject && (
                <span className="text-red-400 text-xs mt-1">
                  {formErrors.subject}
                </span>
              )}
            </div>

            {!checkIsLoggedIn() ? (
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex flex-col gap-2 w-full md:w-1/2">
                  <label className="text-sm md:text-base">Tên</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Tên của bạn"
                    className={`p-3 bg-transparent border ${formErrors.name ? 'border-red-400' : 'border-[#074b6b]'} text-white placeholder:text-gray-400 rounded focus:outline-none focus:border-secondaryColor focus:ring-1 focus:ring-secondaryColor transition`}
                    value={formData.name || ''}
                    onChange={handleChange}
                  />
                  {formErrors.name && (
                    <span className="text-red-400 text-xs mt-1">
                      {formErrors.name}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2 w-full md:w-1/2">
                  <label className="text-sm md:text-base">Email</label>
                  <input
                    type="text"
                    name="email"
                    placeholder="ban@email.com"
                    className={`p-3 bg-transparent border ${formErrors.email ? 'border-red-400' : 'border-[#074b6b]'} text-white placeholder:text-gray-400 rounded focus:outline-none focus:border-secondaryColor focus:ring-1 focus:ring-secondaryColor transition`}
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {formErrors.email && (
                    <span className="text-red-400 text-xs mt-1">
                      {formErrors.email}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              ''
            )}

            {/* <div className="flex flex-col gap-2">
              <label className="text-sm md:text-base">Tệp đính kèm</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="text-white file:bg-[#ffda95] file:border-0 file:text-black file:px-3 file:py-1"
              />
              <span className="text-sm text-gray-400">(không bắt buộc)</span>
            </div> */}

            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm md:text-base">Phone</label>
              <input
                type="phone"
                name="phone"
                placeholder="0999..."
                className={`p-3 bg-transparent border ${formErrors.phone ? 'border-red-400' : 'border-[#074b6b]'} text-white placeholder:text-gray-400 rounded focus:outline-none focus:border-secondaryColor focus:ring-1 focus:ring-secondaryColor transition`}
                value={formData.phone}
                onChange={handleChange}
              />
              {formErrors.phone && (
                <span className="text-red-400 text-xs mt-1">
                  {formErrors.phone}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm md:text-base">Tin nhắn</label>
              <textarea
                name="message"
                rows={6}
                placeholder="Chúng tôi có thể giúp gì cho bạn?"
                className={`p-3 bg-transparent border ${formErrors.message ? 'border-red-400' : 'border-[#074b6b]'} text-white placeholder:text-gray-400 rounded focus:outline-none focus:border-secondaryColor focus:ring-1 focus:ring-secondaryColor transition`}
                value={formData.message}
                onChange={handleChange}
              />
              {formErrors.message && (
                <span className="text-red-400 text-xs mt-1">
                  {formErrors.message}
                </span>
              )}
            </div>

            <div className="text-right">
              <ButtonComponents
                type="submit"
                variant="outline"
                size="small"
                className="px-8"
                disabled={isLoading}
              >
                {isLoading ? 'Đang gửi...' : 'Gửi'}
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
