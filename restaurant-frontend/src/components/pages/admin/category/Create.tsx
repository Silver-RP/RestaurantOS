import React from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryForm from './CategoryForm';

const CreateCategoryPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (formData: FormData) => {
    console.log('Submited form', formData);
    // await createCategory(formData);
  };

  return (
    <div className="relative">
      <button
        onClick={() => navigate('/admin/categories')}
        type="button"
        className="absolute top-0 left-0 text-admintext hover:underline text-sm"
      >
        ← Quay lại danh sách
      </button>

      <CategoryForm
        initialData={undefined}
        submitLabel="Thêm danh mục"
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CreateCategoryPage;