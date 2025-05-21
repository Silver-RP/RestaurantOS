import React, { useEffect, useState } from 'react';
import slugify from 'slugify';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '@hooks/useCategories';
import { FoodDetail } from '../../../../types/Dish.types';
import ImageUploadPreview from '../ImageUploadPreview';
import { Category } from 'types/Category.type';
import { FaChevronDown } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface FoodFormProps {
  initialData?: FoodDetail;
  onSubmit: (formData: FormData) => void;
  categories: Category[];
  submitLabel: string;
}

const FoodForm: React.FC<FoodFormProps> = ({ initialData, onSubmit }) => {
  const navigate = useNavigate();
  const { categories } = useCategories();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState<'hidden' | 'available' | 'soldout'>(
    'available',
  );
  const [price, setPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [discountUntil, setDiscountUntil] = useState<Date | null>(null);
  const [isDishNew, setIsDishNew] = useState(false);
  const [newUntil, setNewUntil] = useState<Date | null>(null);
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [images, setImages] = useState<(File | string)[]>([]);
  const [countInStock, setCountInStock] = useState(0);
  const [origin, setOrigin] = useState('');
  const [alcoholType, setAlcoholType] = useState('');
  const [alcoholContent, setAlcoholContent] = useState(0);
  const [volume, setVolume] = useState(0);

  const selectedCategory = categories?.data.find((c) => c._id === categoryId);
  const isAlcoholCategory =
    selectedCategory?.Cate_name.toLowerCase().includes('đồ uống có cồn');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setSlug(initialData.slug);
      setCategoryId(initialData.categories?.[0]?._id || '');
      setStatus(initialData.status);
      setPrice(initialData.price);
      setDiscountPrice(initialData.discount_price || 0);
      setDiscountUntil(initialData.discountUntil || null);
      setIsDishNew(initialData.isDishNew || false);
      setNewUntil(initialData.newUntil || null);
      setDescription(initialData.description || '');
      setShortDescription(initialData.shortDescription || '');
      setIngredients(initialData.ingredients || '');
      setImages(initialData.images || []);
      setCountInStock(initialData.countInStock);
      setOrigin(initialData.origin || '');
      setAlcoholType(initialData.alcohol_type || '');
      setAlcoholContent(initialData.alcohol_content || 0);
      setVolume(initialData.volume || 0);
    }
  }, [initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    const newFiles = Array.from(fileList);
    if (images.length + newFiles.length > 5) {
      toast.error('Chỉ được tải lên tối đa 5 ảnh');
      return;
    }

    setImages((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const generateSlug = (value: string) =>
    slugify(value, { lower: true, strict: true });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || name.trim().length < 3) {
      toast.error('Tên món ăn phải có ít nhất 3 ký tự');
      return;
    }

    if (price < 0) {
      toast.error('Giá phải lớn hơn hoặc bằng 0');
      return;
    }

    if (discountPrice < 0 || discountPrice > price) {
      toast.error('Giá khuyến mãi phải nhỏ hơn hoặc bằng giá gốc và >= 0');
      return;
    }

    if (countInStock < 0) {
      toast.error('Số lượng tồn kho phải lớn hơn hoặc bằng 0');
      return;
    }

    if (!description.trim()) {
      toast.error('Mô tả không được để trống');
      return;
    }

    if (!categoryId) {
      toast.error('Phải chọn danh mục cho món ăn');
      return;
    }

    if (!['hidden', 'available', 'soldout'].includes(status)) {
      toast.error('Trạng thái không hợp lệ');
      return;
    }

    if (isDishNew && newUntil !== null && newUntil <= new Date()) {
      toast.error('Ngày kết thúc "Món mới" phải lớn hơn ngày hiện tại');
      return;
    }
    

    if (discountPrice > 0 && discountUntil !== null && discountUntil <= new Date()) {
      toast.error('Ngày kết thúc khuyến mãi phải lớn hơn ngày hiện tại');
      return;
    }

    if (images.length === 0) {
      toast.error('Phải chọn ít nhất 1 ảnh');
      return;
    }
    if (images.length > 5) {
      toast.error('Chỉ được tải lên tối đa 5 ảnh');
      return;
    }

    if (alcoholContent < 0 || alcoholContent > 100) {
      toast.error('Nồng độ cồn phải từ 0 đến 100');
      return;
    }
    if (volume && volume < 0) {
      toast.error('Thể tích phải lớn hơn hoặc bằng 0');
      return;
    }

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('slug', slug.trim());
    formData.append('price', String(price));
    formData.append('discount_price', String(discountPrice));
    formData.append('countInStock', String(countInStock));
    formData.append('description', description.trim());
    formData.append('shortDescription', shortDescription.trim());
    formData.append('ingredients', ingredients.trim());
    formData.append('category', categoryId);
    formData.append('status', status);
    formData.append('isDishNew', String(isDishNew));
    if (isDishNew && newUntil) {
      formData.append('newUntil', newUntil.toISOString());
    }
    if (discountPrice > 0 && discountUntil) {
      formData.append('discountUntil', discountUntil.toISOString());
    }
    if (isAlcoholCategory) {
      formData.append('origin', origin.trim());
      formData.append('alcohol_type', alcoholType.trim());
      formData.append('alcohol_content', String(alcoholContent));
      formData.append('volume', String(volume));
    }
    images.forEach((img) => {
      if (img instanceof File) formData.append('images', img);
    });

    onSubmit(formData);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-admintext">
        {initialData ? 'Chỉnh sửa món ăn' : 'Thêm món ăn mới'}
      </h1>
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
              {categories?.data.map((c) => (
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
                        ? discountUntil.toISOString().split('T')[0]
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
                        newUntil ? newUntil.toISOString().split('T')[0] : ''
                      }
                      onChange={(e) => setNewUntil(new Date(e.target.value))}
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
