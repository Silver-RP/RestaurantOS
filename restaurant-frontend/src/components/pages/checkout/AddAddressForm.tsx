import React, { useState } from "react";
import { Address } from "./ModalSelectAddress";

interface AddAddressFormProps {
  onCancel: () => void;
  onSubmit: (newAddress: Omit<Address, "id">) => void;
}

type FormData = Omit<Address, "id">;

const AddAddressForm = ({ onCancel, onSubmit }: AddAddressFormProps) => {
  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    address: "",
    isDefault: false,
  });

  const handleChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.address) return;
    onSubmit(form);
    setForm({ name: "", phone: "", address: "", isDefault: false });
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Họ tên"
        value={form.name}
        onChange={(e) => handleChange("name", e.target.value)}
        className="w-full px-3 py-2 bg-transparent border rounded"
      />
      <input
        type="text"
        placeholder="Số điện thoại"
        value={form.phone}
        onChange={(e) => handleChange("phone", e.target.value)}
        className="w-full px-3 py-2 bg-transparent border rounded"
      />
      <input
        type="text"
        placeholder="Địa chỉ"
        value={form.address}
        onChange={(e) => handleChange("address", e.target.value)}
        className="w-full px-3 py-2 bg-transparent border rounded"
      />
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.isDefault}
          onChange={(e) => handleChange("isDefault", e.target.checked)}
          id="isDefault"
          className="w-4 h-4"
        />
        <label htmlFor="isDefault" className="text-sm text-gray-600">
          Đặt làm địa chỉ mặc định
        </label>
      </div>
      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="text-sm text-gray-500">
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          className="text-sm text-white bg-blue-600 px-4 py-2 rounded"
        >
          Lưu địa chỉ
        </button>
      </div>
    </div>
  );
};

export default AddAddressForm;
