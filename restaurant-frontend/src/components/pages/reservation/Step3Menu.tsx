import React from 'react';
import ButtonComponents from '@components/common/ButtonComponents';
import { ReservationFormData } from '../../../types/ReservationFormData.type';

interface Step3MenuProps {
  formData: ReservationFormData;
  setFormData: React.Dispatch<React.SetStateAction<ReservationFormData>>;
  onNext: () => void;
  onBack: () => void;
}

const menuOptions = [
  { label: 'Gọi món tại nhà hàng', value: 'in-house' },
  { label: 'Seafood Lover B3 - 811.000 VND', value: 'seafood-b3' },
  { label: 'Western Taste B3 - 892.000 VND', value: 'western-b3' },
  { label: 'Seafood Lover C3 - Premium', value: 'seafood-c3' },
];

const Step3Menu: React.FC<Step3MenuProps> = ({ formData, setFormData, onNext, onBack }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-[900px] w-full mx-auto text-white px-4 py-8">
      <h3 className="text-2xl font-semibold mb-4">Chọn menu ấn</h3>

      <select
        name="menu"
        value={(formData as any).menu || ''}
        onChange={handleChange}
        className="w-full p-3 rounded border bg-transparent border-[#074b6b] text-white"
      >
        <option value="">Chọn menu</option>
        {menuOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <div className="flex justify-between mt-6">
        <ButtonComponents variant="outlined" size="small" onClick={onBack}>
          Quay lại
        </ButtonComponents>
        <ButtonComponents variant="filled" size="small" onClick={onNext}>
          Tiếp tục
        </ButtonComponents>
      </div>
    </div>
  );
};

export default Step3Menu;
