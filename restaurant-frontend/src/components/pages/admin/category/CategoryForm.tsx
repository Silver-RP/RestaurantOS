import React, { useEffect, useState } from 'react';
import slugify from 'slugify';
import { useNavigate } from 'react-router-dom';
import {  CategoryCreatePayload } from 'types/Category.type';
import ImageUploadPreview from '../ImageUploadPreview';

type CategoryFormProps = {
  initialData: CategoryCreatePayload | undefined;
  submitLabel: string;
  onSubmit: (data: CategoryCreatePayload) => void;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  
};

const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, onSubmit, submitLabel }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [type, setType] = useState<'dish' | 'drink'>('dish');
  const [image, setImage] = useState<File | string | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.Cate_name);
      setSlug(initialData.Cate_slug);
      setType(initialData.Cate_type as 'dish' | 'drink');
      setImage(initialData.Cate_img || null);
    }
  }, [initialData]);

  const generateSlug = (value: string) => slugify(value, { lower: true, strict: true });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

     if (!name.trim()) {
    newErrors.name = 'Tên danh mục không được để trống';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Tên danh mục phải có ít nhất 3 ký tự';
    }
    if (!slug.trim()) newErrors.slug = 'Slug không được để trống';

    if (!image) {
      newErrors.image = 'Vui lòng chọn ảnh';
    } else if (image instanceof File) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(image.type)) {
        newErrors.image = 'Chỉ chấp nhận ảnh JPG hoặc PNG';
      }
      if (image.size > 2 * 1024 * 1024) {
        newErrors.image = 'Ảnh phải nhỏ hơn 2MB';
      }
}

    setErrors(newErrors);
 
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const formData: CategoryCreatePayload = {
      Cate_name: name.trim(),
      Cate_slug: slug.trim() || generateSlug(name),
      Cate_type: type,
      Cate_img: image instanceof File ? image : undefined,
    };
    
    
    onSubmit(formData);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg w-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-admintext">
        {initialData ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tên danh mục */}
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
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Slug */}
        <div>
          <label className="block mb-1 text-sm font-medium text-admintext">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="border rounded px-4 py-2 w-full"
          />
          {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
        </div>

        {/* Loại */}
        <div>
          <label className="block mb-1 text-sm font-medium text-admintext">Loại</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value.trim() as 'dish' | 'drink')}
            className="border rounded px-4 py-2 w-full"
          >
            <option value="dish">Món ăn</option>
            <option value="drink">Đồ uống</option>
          </select>
        </div>

        <ImageUploadPreview
          images={image ? [image] : []}
          onChange={handleImageChange} onRemove={function (index: number): void {
            throw new Error('Function not implemented.');
          } }        />
        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}

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
