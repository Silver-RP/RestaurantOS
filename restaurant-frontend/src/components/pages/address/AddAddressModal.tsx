/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FiChevronDown } from 'react-icons/fi';
import { createAddress } from '@/api/AddressApi';
import { toast } from 'react-toastify';
import { Listbox, ListboxButton, ListboxOptions } from '@headlessui/react';
import { useDistricts, useWards } from '@/hooks/useAddress';
import GlobalModal from '@/components/common/GlobalModal';
interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    province: string,
    ward: string,
    street_address: string,
    full_name: string,
    phone: string,
    addressType: string,
  ) => void;
  total: number;
}
interface FormValues {
  full_name: string;
  district: string;
  province: string;
  ward: string;
  street_address: string;
  phone: string;
}

export const AddAddressModal: React.FC<AddAddressModalProps> = ({
  isOpen,
  onClose,
  onSave,
  total,
}) => {
  const [selectedProvinceCode] = useState('79');
  const { districts } = useDistricts(selectedProvinceCode);
  const [selectedDistrictCode, setSelectedDistrictCode] = useState('');
  const { wards } = useWards(selectedDistrictCode);
  const [addressType, setAddressType] = useState('home');
  const [isDefault, setIsDefault] = useState(false);
  const [selectedWard, setSelectedWard] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [districtError, setDistrictError] = useState('');
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    trigger,

  } = useForm<FormValues>({
    defaultValues: {
      full_name: '',
      province: selectedProvinceCode,
      ward: '',
      street_address: '',
      phone: '',
    },
  });


  useEffect(() => {
    if (isOpen) {
      setSelectedDistrictCode('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setSelectedWard('');
      setIsDuplicate(false);
      reset();
    }
  }, [isOpen]);


  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const onSubmit = async (data: FormValues) => {
    if (total >= 5) {
      toast.error('Bạn đã đạt giới hạn 5 địa chỉ. Không thể thêm mới.');
      return;
    }

    // Bắt lỗi chưa chọn quận
    if (!selectedDistrictCode) {
      setDistrictError('Vui lòng chọn quận/huyện!');
      return;
    } else {
      setDistrictError('');
    }

    const isValid = await trigger([
      'full_name',
      'province',
      'phone',
      'ward',
      'street_address',
    ]);

    const missingWard = !data.ward;

    if (!isValid || missingWard) {
      return;
    }
    const selectedDistrict = districts.find((d) => d.code === selectedDistrictCode);
    const selectedWardObj = wards.find((w) => w.name === selectedWard);
    const fullSubmitData = {
      full_name: data.full_name,
      phone: data.phone,
      province: selectedDistrict?.province_code || selectedProvinceCode,
      province_code: selectedProvinceCode,
      district: selectedDistrict?.name || '',
      district_code: selectedDistrictCode,
      ward: selectedWard,
      ward_code: selectedWardObj?.code || '',
      street_address: data.street_address,
      address_type: addressType.toUpperCase() as 'HOME' | 'WORK' | 'OTHER',
      is_default: isDefault || total === 0,
      lat: 0, // Replace with actual latitude if available
      lon: 0, // Replace with actual longitude if available
    };

    try {
      await createAddress(fullSubmitData);
      try {
        onClose();
        console.log('Modal đóng thành công');
      } catch (err) {
        console.error(' Lỗi khi gọi onClose():', err);
      }

      try {
        onSave(
          selectedProvinceCode,
          selectedWard,
          data.street_address,
          data.full_name,
          data.phone,
          addressType,
        );
        console.log('Gọi onSave thành công');
      } catch (err) {
        console.error('Lỗi khi gọi onSave():', err);
      }

      reset();
      setIsDuplicate(false);
    } catch (error: any) {
      console.error('Lỗi khi gọi createAddress:', error);
      if (error.response?.status === 409) {
        setIsDuplicate(true);
        toast.error('Địa chỉ này đã tồn tại!');
      } else {
        toast.error('Tạo địa chỉ thất bại. Vui lòng thử lại sau.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <GlobalModal>
      <div
        className="bg-bodyBackground p-4 sm:p-5 md:p-6 rounded-lg w-full sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-4/12 border border-[#FFE0A0] max-h-[90vh] sm:max-h-[85vh] md:max-h-[80vh] overflow-y-auto relative"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-2xl sm:text-3xl md:text-4xl"
          aria-label="Đóng"
        >
          &times;
        </button>

        <h2 className="text-xl sm:text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4">
          Thêm Địa Chỉ
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 md:space-y-6"
        >
          <div>
            <label className="text-gray-400 text-sm md:text-base">
              Họ và Tên
            </label>
            <Controller
              name="full_name"
              control={control}
              rules={{ required: 'Tên không được để trống' }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="w-full bg-transparent border-b border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-secondaryColor py-1 md:py-2 text-sm md:text-base"
                  placeholder="Nhập họ và tên"
                />
              )}
            />
            {errors.full_name && (
              <span className="text-red-500 text-xs sm:text-sm">
                {errors.full_name?.message}
              </span>
            )}
          </div>
          <div>
            <label className="text-gray-400 text-sm md:text-base">
              Số Điện Thoại
            </label>
            <Controller
              name="phone"
              control={control}
              rules={{
                required: 'Số điện thoại không được để trống',
                validate: (value) =>
                  validatePhone(value) || 'Số điện thoại không hợp lệ',
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="w-full bg-transparent border-b border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-secondaryColor py-1 md:py-2 text-sm md:text-base"
                  placeholder="Nhập số điện thoại"
                />
              )}
            />
            {errors.phone && (
              <span className="text-red-500 text-xs sm:text-sm">
                {errors.phone?.message}
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="text-gray-400 text-sm md:text-base mb-1">
                Tỉnh / Thành Phố
              </label>
              <div className="border-b border-gray-500 py-1.5 text-white text-sm md:text-base">
                <span className="truncate capitalize">
                  {
                    (districts?.[0]?.province ?? 'Hồ Chí Minh')
                      .replace(/^\s*(Thành phố|TP\.?|Tp\.?)\s+/i, '')
                      .trim()
                  }
                </span>
              </div>
            </div>
            <Controller
              name="district"
              control={control}
              rules={{ required: 'Vui lòng chọn Quận/Huyện' }}
              render={({ field }) => (
                <div className="flex flex-col">
                  <label className="text-gray-400 text-sm md:text-base mb-1">Quận/Huyện</label>
                  <Listbox
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      setSelectedDistrictCode(value);
                      setSelectedWard('');
                      setValue('ward', '');
                    }}
                  >
                    <div className="relative">
                      <ListboxButton className="w-full bg-transparent border-b border-gray-500 text-white py-1.5 flex items-center justify-between text-sm md:text-base">
                        <span className="truncate capitalize">
                          {districts.find((d) => d.code === field.value)?.name || 'Chọn quận/huyện'}
                        </span>
                        <FiChevronDown className="ml-2 text-white" />
                      </ListboxButton>

                      <ListboxOptions className="absolute w-full mt-1 bg-bodyBackground border border-white/20 rounded-md shadow-lg z-10 max-h-60 overflow-auto text-sm">
                        {districts.map((district) => (
                          <Listbox.Option
                            key={district.code}
                            value={district.code}
                            className={({ active, selected }) =>
                              `p-2 cursor-pointer rounded-md transition ${active ? 'bg-white/10' : ''
                              } ${selected ? 'border-l-4 border-secondaryColor' : ''}`
                            }
                          >
                            {district.name}
                          </Listbox.Option>
                        ))}
                      </ListboxOptions>
                    </div>
                  </Listbox>
                  {errors.district && (
                    <span className="text-red-500 text-[12px] mt-1">{errors.district.message}</span>
                  )}
                </div>
              )}
            />
            <Controller
              name="ward"
              control={control}
              rules={{ required: 'Vui lòng chọn Phường' }}
              render={({ field }) => (
                <div className="flex flex-col">
                  <label className="text-gray-400 text-sm md:text-base mb-1">
                    Phường
                  </label>
                  <Listbox
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      setSelectedWard(value);
                    }}
                  >
                    <div className="relative">
                      <ListboxButton className="w-full bg-transparent border-b border-gray-500 text-white py-1.5 flex items-center justify-between text-[11px] md:text-base">
                        <span className="truncate capitalize">
                          {field.value || 'Chọn phường'}
                        </span>
                        <FiChevronDown className="ml-2 text-white" />
                      </ListboxButton>

                      <ListboxOptions className="absolute w-full mt-1 bg-bodyBackground border border-white/20 rounded-md shadow-lg z-10 max-h-60 overflow-auto text-sm">
                        {wards.map((ward) => (
                          <Listbox.Option
                            key={ward.code}
                            value={ward.name}
                            className={({ active, selected }) =>
                              `p-2 cursor-pointer rounded-md transition ${active ? 'bg-white/10' : ''
                              } ${selected ? 'border-l-4 border-secondaryColor' : ''}`
                            }
                          >
                            {ward.name}
                          </Listbox.Option>
                        ))}
                      </ListboxOptions>
                    </div>
                  </Listbox>

                  {errors.ward && (
                    <span className="text-red-500 text-[12px] mt-1">
                      {errors.ward.message}
                    </span>
                  )}
                </div>
              )}
            />
          </div>

          <div>
            {!selectedWard ? (
              <p className="text-sm italic text-gray-400">
                Vui lòng chọn Quận/Phường trước khi nhập địa chỉ chi tiết
              </p>
            ) : (
              <Controller
                name="street_address"
                control={control}
                rules={{ required: 'Địa chỉ không được để trống' }}
                render={({ field }) => (
                  <div className="relative">
                    <input
                      {...field}
                      type="text"
                      placeholder="Nhập địa chỉ chi tiết, ví dụ: 123 Tô Ký"
                      className="w-full bg-transparent border-b border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-secondaryColor py-1 md:py-2 text-sm md:text-base"
                    />
                  </div>
                )}
              />
            )}

            {errors.street_address && (
              <span className="text-red-500 text-xs sm:text-sm">
                {errors.street_address?.message}
              </span>
            )}
          </div>

          <div>
            <label className="text-gray-400 text-sm md:text-base mb-2 block">
              Loại Địa Chỉ
            </label>
            <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="addressType"
                  value="home"
                  checked={addressType === 'home'}
                  onChange={(e) => setAddressType(e.target.value)}
                  className="hidden"
                />
                <span
                  className={`px-3 sm:px-4 md:px-6 py-1 md:py-2 rounded-md border border-gray-500 text-xs sm:text-sm md:text-base ${addressType === 'home' ? 'bg-secondaryColor text-black' : 'bg-bodyBackground text-white'}`}
                >
                  Nhà riêng
                </span>
              </label>

              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="addressType"
                  value="office"
                  checked={addressType === 'office'}
                  onChange={(e) => setAddressType(e.target.value)}
                  className="hidden"
                />
                <span
                  className={`px-3 sm:px-4 md:px-6 py-1 md:py-2 rounded-md border border-gray-500 text-xs sm:text-sm md:text-base ${addressType === 'office' ? 'bg-secondaryColor text-black' : 'bg-bodyBackground text-white'}`}
                >
                  Văn phòng
                </span>
              </label>

              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="addressType"
                  value="other"
                  checked={addressType === 'other'}
                  onChange={(e) => setAddressType(e.target.value)}
                  className="hidden"
                />
                <span
                  className={`px-3 sm:px-4 md:px-6 py-1 md:py-2 rounded-md border border-gray-500 text-xs sm:text-sm md:text-base ${addressType === 'other' ? 'bg-secondaryColor text-black' : 'bg-bodyBackground text-white'}`}
                >
                  Khác
                </span>
              </label>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={() => setIsDefault(!isDefault)}
              id="isDefault"
              className="text-secondaryColor"
            />
            <label
              htmlFor="isDefault"
              className="text-white text-xs sm:text-sm md:text-base"
            >
              Đặt làm địa chỉ mặc định
            </label>
          </div>

          <div className="flex justify-end gap-3 md:gap-4 mt-4 md:mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-3 sm:px-4 md:px-6 py-1 md:py-2 border border-secondaryColor text-secondaryColor hover:bg-bodyBackground hover:text-white transition uppercase text-xs sm:text-sm md:text-base"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isDuplicate}
              className={`px-3 sm:px-4 md:px-6 py-1 md:py-2 border border-secondaryColor bg-secondaryColor text-headerBackground hover:bg-bodyBackground hover:text-white transition uppercase text-xs sm:text-sm md:text-base ${isDuplicate ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isDuplicate ? 'Địa chỉ đã tồn tại' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </GlobalModal>
  );
};


