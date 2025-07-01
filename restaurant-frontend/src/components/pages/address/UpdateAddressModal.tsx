import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Listbox } from '@headlessui/react';
import { FiChevronDown } from 'react-icons/fi';
import { AddressInput } from './AddressInput';
import { MapDisplay } from './MapDisplay';
import { updateAddress } from '@/api/AddressApi';
import { cities, wardsByDistrict } from '@/utils/DataAddress';

interface UpdateAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: any;
  onSave: () => void;
}

interface FormValues {
  full_name: string;
  province: string;
  district: string;
  ward: string;
  phone: string;
  street_address: string;
  address_type: 'HOME' | 'WORK' | 'other';
  is_default: boolean;
}

export const UpdateAddressModal: React.FC<UpdateAddressModalProps> = ({
  isOpen,
  onClose,
  address,
  onSave,
}) => {
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      full_name: '',
      phone: '',
      street_address: '',
      province: 'TP. Hồ Chí Minh',
      district: '',
      ward: '',
      address_type: 'HOME',
      is_default: false,
    },
  });

  useEffect(() => {
    if (address) {
      const fallbackStreet =
        address.street_address?.split(',').map((s: string) => s.trim()) || [];
      reset({
        full_name: address.name || address.full_name || '',
        phone: address.phone || '',
        street_address: fallbackStreet[0] || address.street_address || '',
        ward: address.ward || fallbackStreet[1] || '',
        district: address.district || fallbackStreet[2] || '',
        province: address.province || fallbackStreet[3] || 'TP. Hồ Chí Minh',
        address_type: address.address_type || 'HOME',
        is_default: address.is_default || false,
      });
      setDistrict(address.district || fallbackStreet[2] || '');
      setWard(address.ward || fallbackStreet[1] || '');
      setLat(address.lat || 0);
      setLon(address.lon || 0);
    }
  }, [address, reset]);

  const watchedStreet = watch('street_address');

  useEffect(() => {
    const timer = setTimeout(async () => {
      setAddressError(null); // Reset lỗi cũ
      if (watchedStreet.length > 5 && ward && district) {
        const full = `${watchedStreet}, ${ward}, ${district}, TP. Hồ Chí Minh`;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(full)}&format=json`,
          );
          const json = await res.json();
          if (json.length > 0) {
            setLat(parseFloat(json[0].lat));
            setLon(parseFloat(json[0].lon));
          } else {
            setLat(0);
            setLon(0);
            setAddressError('Không tìm thấy đường này trên bản đồ');
          }
        } catch (e) {
          console.error('Lỗi tìm kiếm toạ độ:', e);
          setAddressError('Lỗi khi tìm địa chỉ. Vui lòng thử lại.');
        }
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [watchedStreet, ward, district]);

  const onSubmit = async (data: FormValues) => {
    if (!district || !ward) {
      alert('Vui lòng nhập đầy đủ quận và phường');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await updateAddress(address.id, {
        ...data,
        district,
        ward,
        province: 'TP. Hồ Chí Minh',
        lat: lat || undefined,
        lon: lon || undefined, // Gửi lên, BE sẽ tự xử nếu thiếu
      });

      // 👉 nhận lại địa chỉ đã chuẩn hóa
      if (response?.data) {
        console.log('✅ Địa chỉ sau khi chuẩn hóa:', response.data);
      }

      onSave();
    } catch (err) {
      console.error('❌ Lỗi cập nhật địa chỉ:', err);
      alert('Cập nhật địa chỉ thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4 overflow-auto">
      <div className="bg-bodyBackground p-4 sm:p-5 md:p-6 rounded-lg w-full sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-5/12 border border-[#FFE0A0] max-h-[90vh] overflow-y-auto relative">
        <h2 className="text-xl font-bold text-white mb-4">Cập nhật địa chỉ</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-gray-400">Họ tên</label>
              <Controller
                name="full_name"
                control={control}
                rules={{ required: 'Vui lòng điền Họ tên' }}
                render={({ field }) => (
                  <input
                    {...field}
                    className="w-full bg-transparent border-b border-gray-500 text-white py-2 focus:outline-none"
                  />
                )}
              />
              {errors.full_name && (
                <p className="text-red-500 text-sm">
                  {errors.full_name.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-gray-400">Số điện thoại</label>
              <Controller
                name="phone"
                control={control}
                rules={{
                  required: 'Vui lòng nhập số điện thoại',
                  pattern: {
                    value: /^[0-9]{9,11}$/,
                    message: 'Số điện thoại không hợp lệ',
                  },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    className="w-full bg-transparent border-b border-gray-500 text-white py-2 focus:outline-none"
                  />
                )}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-gray-400">Tỉnh / Thành phố</label>
              <div className="w-full border-b border-gray-500 py-2 text-white">
                TP. Hồ Chí Minh
              </div>
            </div>

            <div>
              <label className="text-gray-400">Quận / Huyện</label>
              <Listbox
                value={district}
                onChange={(val) => setDistrict(val.trim())}
              >
                <div className="relative capitalize">
                  <Listbox.Button className="w-full border-b border-gray-500 py-2 text-white flex justify-between">
                    <span>{district || 'Chọn quận'}</span>
                    <FiChevronDown />
                  </Listbox.Button>
                  <Listbox.Options className="absolute mt-1 max-h-60 overflow-auto bg-bodyBackground border border-white/20 z-10 capitalize">
                    {cities
                      .find((c) => c.name === 'TP. Hồ Chí Minh')
                      ?.districts.map((d) => (
                        <Listbox.Option
                          key={d}
                          value={d}
                          className="p-2 text-sm hover:bg-white/10 cursor-pointer capitalize"
                        >
                          {d}
                        </Listbox.Option>
                      ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>

            <div>
              <label className="text-gray-400">Phường / Xã</label>
              <Listbox value={ward} onChange={(val) => setWard(val.trim())}>
                <div className="relative">
                  <Listbox.Button className="w-full border-b border-gray-500 py-2 text-white flex justify-between">
                    <span>{ward || 'Chọn phường'}</span>
                    <FiChevronDown />
                  </Listbox.Button>
                  <Listbox.Options className="absolute mt-1 max-h-60 overflow-auto bg-bodyBackground border border-white/20 z-10">
                    {(wardsByDistrict[district] || []).map((w) => (
                      <Listbox.Option
                        key={w}
                        value={w}
                        className="p-2 text-sm hover:bg-white/10 cursor-pointer"
                      >
                        {w}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>
          </div>

          <div>
            <label className="text-gray-400">Tên đường</label>
            <Controller
              name="street_address"
              control={control}
              rules={{ required: 'Vui lòng nhập tên đường' }}
              render={({ field }) => (
                <AddressInput
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e)}
                  onSelectLocation={(lat, lon, street) => {
                    setLat(lat);
                    setLon(lon);
                    setValue('street_address', street);
                  }}
                />
              )}
            />
            {errors.street_address && (
              <p className="text-red-500 text-sm">
                {errors.street_address.message}
              </p>
            )}
            {addressError && (
              <p className="text-red-500 text-sm mt-1">{addressError}</p>
            )}
          </div>

          {lat !== 0 && lon !== 0 && (
            <div className="mt-3">
              <MapDisplay lat={lat} lon={lon} street_address={watchedStreet} />
            </div>
          )}

          <div className="mt-4">
            <label className="text-gray-400">Loại địa chỉ</label>
            <Controller
              name="address_type"
              control={control}
              render={({ field }) => (
                <div className="flex gap-2 mt-2">
                  {['HOME', 'WORK', 'other'].map((type) => (
                    <button
                      type="button"
                      key={type}
                      className={`px-4 py-2 rounded border transition ${
                        field.value === type
                          ? 'bg-secondaryColor text-black'
                          : 'border-gray-500 text-white'
                      }`}
                      onClick={() => field.onChange(type)}
                    >
                      {type === 'HOME'
                        ? 'Nhà riêng'
                        : type === 'WORK'
                          ? 'Văn phòng'
                          : 'Khác'}
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          <div className="flex items-center gap-2">
            <Controller
              name="is_default"
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="form-checkbox"
                />
              )}
            />
            <label className="text-white">Đặt làm địa chỉ mặc định</label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-secondaryColor text-secondaryColor rounded-md"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-secondaryColor text-black rounded-md disabled:opacity-50"
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
