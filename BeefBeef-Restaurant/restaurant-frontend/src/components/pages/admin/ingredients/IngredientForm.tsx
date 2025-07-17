import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ingredient } from '../../../../types/IngredientType';
import { FaChevronDown } from 'react-icons/fa';
import { useIngredientLogic } from '@/hooks/useIngredientsAdminLogic';
import ConfirmModal from '@/components/common/ConfirmModal';
import { FiTrash2 } from "react-icons/fi"
import { ingredientUnits, IngredientGroup, IngredientSubGroups } from '../../../../types/ingredientUnitsType';

interface IngredientFormProps {
  initialData?: Ingredient;
  onSubmit: (data: {
    name: string;
    slug: string;
    unit: string;
    price_per_unit: number;
    lowStockThreshold?: number;
  }) => void;
}

const IngredientForm: React.FC<IngredientFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const navigate = useNavigate();
  
  const {
    name,
    setName,
    unit,
    setUnit,
    group,
    setGroup,
    subGroup,
    setSubGroup,
    pricePerUnit,
    setPricePerUnit,
    lowStockThreshold, 
    setLowStockThreshold,
    slug,
    setSlug,
    handleDeleteClick,
    showConfirm,
    setShowConfirm,
    generateSlug,
    handleSubmit,
    handleConfirmDelete
  } = useIngredientLogic({ initialData, onSubmit});

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-admintext">
          {initialData ? 'Chỉnh sửa nguyên liệu' : 'Thêm nguyên liệu mới'}
        </h1>

        {initialData && (
          <button
          type="button"
          onClick={handleDeleteClick}
          className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 gap-2"
          title="Xoá nguyên liệu"
        >
          <FiTrash2 />
          <span className="hidden sm:inline">Xoá</span>
        </button>
        
        )}
      </div>

      {showConfirm && (
        <ConfirmModal
          title="Xác nhận xoá"
          description={`Bạn có chắc chắn muốn xoá "${initialData?.name || 'nguyên liệu'}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block mb-1 text-sm font-medium text-admintext">
              Tên nguyên liệu
              <span className="text-red-600 ml-1">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSlug(generateSlug(e.target.value));
              }}
              className="border rounded px-4 py-2 w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-admintext">
              Slug
              <span className="text-red-600 ml-1">*</span>
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="border rounded px-4 py-2 w-full"
              readOnly
              required
            />
          </div>
          <div className="relative mb-4">
            <label className="block mb-1 text-sm font-medium text-admintext">
              Nhóm nguyên liệu 
            </label>
            <select
              value={group}
              onChange={(e) => {
                const value = e.target.value;
                setGroup(value);
                setSubGroup('');
              }}
              className="appearance-none border rounded px-4 py-2 w-full pr-10  text-sm"
            >
              <option value="">-- Chọn nhóm nguyên liệu --</option>
              {IngredientGroup.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <FaChevronDown className="absolute top-10 right-3 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
          {group && (
            <div className="relative mb-4">
              <label className="block mb-1 text-sm font-medium text-admintext">
                Nhóm con nguyên liệu 
              </label>
              <select
                value={subGroup}
                onChange={(e) => setSubGroup(e.target.value)}
                className="appearance-none border rounded px-4 py-2 w-full pr-10  text-sm"
              >
                <option value="">-- Chọn nhóm con --</option>
                {(IngredientSubGroups[group] || []).map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            <FaChevronDown className="absolute top-10 right-3 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          )}
          <div className="relative mb-4">
            <label className="block mb-1 text-sm font-medium text-admintext">
              Đơn vị
              <span className="text-red-600 ml-1">*</span>
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="appearance-none border rounded px-4 py-2 w-full pr-10  text-sm"
              required
            >
              <option value="">-- Chọn đơn vị --</option>
              {ingredientUnits.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <FaChevronDown className="absolute top-11 right-5 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-admintext">
              Giá trên mỗi đơn vị (VND)
              <span className="text-red-600 ml-1">*</span>
            </label>
            <input
              type="number"
              value={pricePerUnit}
              onChange={(e) => setPricePerUnit(Number(e.target.value))}
              className="border rounded px-4 py-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-admintext">
              Ngưỡng cảnh báo tồn kho
            </label>
            <input
              type="number"
              min={0}
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(Number(e.target.value))}
              className="border rounded px-4 py-2 w-full"
            />
           <div className="mt-1 text-sm text-gray-500">
            * Giá trị ngưỡng được tính theo <strong>đơn vị của nguyên liệu</strong>
          </div>
          </div>

        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate('/admin/ingredients')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Huỷ
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-adminprimary text-white rounded hover:bg-blue-700"
          >
            {initialData ? 'Cập nhật' : 'Lưu nguyên liệu'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IngredientForm;
