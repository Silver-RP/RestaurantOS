import React, { useEffect, useState } from 'react';
import slugify from 'slugify';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '@hooks/useCategories';
import { FoodDetail } from '../../../../types/Dish.types';
import ImageUploadPreview from '../ImageUploadPreview';
import { Category } from 'types/Category.type';
import { FaChevronDown } from 'react-icons/fa';

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
  const [price, setPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [countInStock, setCountInStock] = useState(0);
  const [categoryId, setCategoryId] = useState('');
  const [images, setImages] = useState<(File | string)[]>([]);
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [ingredients, setIngredients] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setSlug(initialData.slug);
      setPrice(initialData.price);
      setDiscountPrice(initialData.discount_price || 0);
      setCountInStock(initialData.countInStock);
      setCategoryId(initialData.categories?.[0]?._id || '');
      setDescription(initialData.description || '');
      setShortDescription(initialData.shortDescription || '');
      setIngredients(initialData.ingredients || '');
      setImages(initialData.images || []);
    }
  }, [initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    setImages((prev) => [...prev, ...Array.from(fileList)]);
  };

  const generateSlug = (value: string) =>
    slugify(value, { lower: true, strict: true });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('slug', slug.trim() || generateSlug(name));
    formData.append('price', String(price));
    formData.append('discount_price', String(discountPrice));
    formData.append('countInStock', String(countInStock));
    formData.append('description', description.trim());
    formData.append('shortDescription', shortDescription.trim());
    formData.append('ingredients', ingredients.trim());
    formData.append('category', categoryId);

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
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="border rounded px-4 py-2 w-full"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-admintext">
              Giá
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
              Giá KM
            </label>
            <input
              type="number"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(Number(e.target.value))}
              className="border rounded px-4 py-2 w-full"
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

          <div>
            <label className="block mb-1 text-sm font-medium text-admintext">
              Danh mục
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="appearance-none border rounded px-4 py-2 w-full pr-10"
              required
            >
              <option value="">-- Chọn danh mục --</option>
              {categories?.data.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.Cate_name}
                </option>
              ))}
            </select>
            <FaChevronDown className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-admintext">
            Mô tả
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded px-4 py-2 w-full h-28"
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

        <ImageUploadPreview images={images} onChange={handleImageChange} />

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
