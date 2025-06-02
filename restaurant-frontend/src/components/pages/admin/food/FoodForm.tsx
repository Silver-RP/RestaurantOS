import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FoodDetail } from '../../../../types/Dish.types';
import ImageUploadPreview from '../ImageUploadPreview';
import { Category } from 'types/Category.type';
import { FaChevronDown } from 'react-icons/fa';
import { useFoodLogic } from '@/hooks/useFoodsAdminLogic';
import ConfirmModal from '@/components/common/ConfirmModal';
import { FiTrash2 } from "react-icons/fi"

interface FoodFormProps {
  initialData?: FoodDetail;
  onSubmit: (formData: FormData) => void;
  categories: Category[];
  submitLabel: string;
}

const FoodForm: React.FC<FoodFormProps> = ({
  initialData,
  onSubmit,
  categories,
}) => {
  const navigate = useNavigate();
  
  const {
    name,
    setName,
    slug,
    setSlug,
    categoryId,
    setCategoryId,
    status,
    setStatus,
    price,
    setPrice,
    discountPrice,
    setDiscountPrice,
    discountUntil,
    setDiscountUntil,
    isDishNew,
    setIsDishNew,
    newUntil,
    setNewUntil,
    isRecommend,
    setIsRecommend,
    recommendUntil,
    setRecommendUntil,
    description,
    setDescription,
    shortDescription,
    setShortDescription,
    ingredients,
    setIngredients,
    images,
    handleImageChange,
    handleRemoveImage,
    countInStock,
    setCountInStock,
    origin,
    setOrigin,
    alcoholType,
    setAlcoholType,
    alcoholContent,
    setAlcoholContent,
    volume,
    setVolume,
    handleSubmit,
    generateSlug,
    isAlcoholCategory,
    handleDeleteClick,
    showConfirm,
    setShowConfirm,
    handleConfirmDelete
  } = useFoodLogic({ initialData, categories, onSubmit });

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-admintext">
          {initialData ? 'Chỉnh sửa món ăn' : 'Thêm món ăn mới'}
        </h1>

        {initialData && (
          <button
          type="button"
          onClick={handleDeleteClick}
          className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 gap-2"
          title="Xoá món ăn"
        >
          <FiTrash2 />
          <span className="hidden sm:inline">Xoá</span>
        </button>
        
        )}
      </div>

      {showConfirm && (
        <ConfirmModal
          title="Xác nhận xoá"
          description={`Bạn có chắc chắn muốn xoá "${initialData?.name || 'món ăn'}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 text-sm font-medium text-admintext">
              Tên món
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
              Danh mục
              <span className="text-red-600 ml-1">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="appearance-none border rounded px-4 py-2 w-full pr-10  text-sm"
              required
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.Cate_name}
                </option>
              ))}
            </select>
            <FaChevronDown className="absolute top-10 right-3 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-admintext">
              Trạng thái
            </label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as 'hidden' | 'available' | 'soldout')
              }
              className="border rounded px-2 py-2 w-full text-sm"
            >
              <option value="available">Có sẵn</option>
              <option value="hidden">Ẩn</option>
              <option value="soldout">Hết hàng</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-admintext">
              Giá (VND)
              <span className="text-red-600 ml-1">*</span>
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="border rounded px-4 py-2 w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-admintext">
              Kho
            </label>
            <input
              type="number"
              value={countInStock}
              onChange={(e) => setCountInStock(Number(e.target.value))}
              className="border rounded px-4 py-2 w-full"
            />
          </div>

          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 text-sm font-medium text-admintext">
                  Giá khuyến mãi (VND)
                </label>
                <input
                  type="number"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(Number(e.target.value))}
                  className="border rounded px-4 py-2 w-full"
                />
              </div>

              {discountPrice > 0 && (
                <div>
                  <label className="block mb-1 text-sm font-medium text-admintext">
                    Khuyến mãi đến
                  </label>
                  <input
                    type="date"
                    value={
                      discountUntil
                        ? new Date(discountUntil).toISOString().split('T')[0]
                        : ''
                    }
                    onChange={(e) => setDiscountUntil(new Date(e.target.value))}
                    className="border rounded px-4 py-2 w-full"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-2 mb-2">
                <input
                  id="isDishNew"
                  type="checkbox"
                  checked={isDishNew}
                  onChange={(e) => setIsDishNew(e.target.checked)}
                  className="accent-adminprimary w-4 h-4"
                />
                <label
                  htmlFor="isDishNew"
                  className="text-sm font-medium text-admintext"
                >
                  Đánh dấu là món ăn mới
                </label>
              </div>

              {isDishNew && (
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-admintext">
                      Giữ trạng thái “mới” đến ngày
                    </label>
                    <input
                      type="date"
                      value={
                        newUntil ? new Date(newUntil).toISOString().split('T')[0] : ''
                      }
                      onChange={(e) => setNewUntil(new Date(e.target.value))}
                      className="border rounded px-4 py-2 w-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-2 mb-2">
                <input
                  id="isRecommend"
                  type="checkbox"
                  checked={isRecommend}
                  onChange={(e) => setIsRecommend(e.target.checked)}
                  className="accent-adminprimary w-4 h-4"
                />
                <label
                  htmlFor="isRecommend"
                  className="text-sm font-medium text-admintext"
                >
                  Đánh dấu là món ăn được đề xuất
                </label>
              </div>

              {isRecommend && (
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-admintext">
                      Giữ trạng thái "được đề xuất" đến ngày
                    </label>
                    <input
                      type="date"
                      value={
                        recommendUntil ? new Date(recommendUntil).toISOString().split('T')[0] : ''
                      }
                      onChange={(e) => setRecommendUntil(new Date(e.target.value))}
                      className="border rounded px-4 py-2 w-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {isAlcoholCategory && (
            <>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-admintext">
                  Xuất xứ
                </label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="border rounded px-4 py-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-admintext">
                  Loại rượu
                </label>
                <input
                  type="text"
                  value={alcoholType}
                  onChange={(e) => setAlcoholType(e.target.value)}
                  className="border rounded px-4 py-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-admintext">
                  Nồng độ cồn (%)
                </label>
                <input
                  type="number"
                  value={alcoholContent}
                  onChange={(e) => setAlcoholContent(Number(e.target.value))}
                  className="border rounded px-4 py-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-admintext">
                  Thể tích (ml)
                </label>
                <input
                  type="number"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="border rounded px-4 py-2 w-full"
                />
              </div>
            </>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-admintext">
            Nguyên liệu
          </label>
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="border rounded px-4 py-2 w-full"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-admintext">
            Mô tả
            <span className="text-red-600 ml-1">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded px-4 py-2 w-full h-28"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-admintext">
            Mô tả ngắn
          </label>
          <textarea
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="border rounded px-4 py-2 w-full"
          />
        </div>

        <ImageUploadPreview
          images={images}
          onChange={handleImageChange}
          onRemove={handleRemoveImage}
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate('/admin/foods')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Huỷ
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-adminprimary text-white rounded hover:bg-blue-700"
          >
            {initialData ? 'Cập nhật món' : 'Lưu món ăn'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FoodForm;
