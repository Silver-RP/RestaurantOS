// components/pages/admin/category/CategoryForm.tsx
import React, { useEffect, useState } from 'react';
import slugify from 'slugify';
import { useNavigate } from 'react-router-dom';
import { Category } from 'types/Category.type';
import ImageUploadPreview from '../ImageUploadPreview';

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (formData: FormData) => void;
  submitLabel: string;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, onSubmit, submitLabel }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [type, setType] = useState<'dish' | 'drink'>('dish');
  const [image, setImage] = useState<File | string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.Cate_name);
      setSlug(initialData.Cate_slug);
      setType(initialData.Cate_type as 'dish' | 'drink');
      setImage(initialData.Cate_img || null);
    }
  }, [initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  const generateSlug = (value: string) => slugify(value, { lower: true, strict: true });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('Cate_name', name.trim());
    formData.append('Cate_slug', slug.trim() || generateSlug(name));
    formData.append('Cate_type', type);
    if (image instanceof File) formData.append('Cate_img', image);
    onSubmit(formData);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg w-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-admintext">
        {initialData ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 text-sm font-medium text-admintext">Tên danh mục</label>
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
          <label className="block mb-1 text-sm font-medium text-admintext">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="border rounded px-4 py-2 w-full"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-admintext">Loại</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'dish' | 'drink')}
            className="border rounded px-4 py-2 w-full"
            required
          >
            <option value="dish">Món ăn</option>
            <option value="drink">Đồ uống</option>
          </select>
        </div>

        <ImageUploadPreview
          images={image ? [image] : []}
          onChange={handleImageChange}
        //   single
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate('/admin/categories')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Huỷ
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-adminprimary text-white rounded hover:bg-blue-700"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
