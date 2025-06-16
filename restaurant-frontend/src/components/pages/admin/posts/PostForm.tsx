import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploadPreview from '../ImageUploadPreview';
import '@toast-ui/editor/dist/toastui-editor.css'; 
import { Editor } from '@toast-ui/react-editor';
import { Editor as ToastEditor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { useRef } from 'react';

interface PostFormProps {
  initialData?: {
    title: string;
    content: string;
    images: string[];
    categories_id: string;
    desc: string;
    status: string;
  };
  onSubmit: (formData: FormData) => void;
  categories: { _id: string; Cate_name: string; }[];
  isSubmitting?: boolean;
}


const PostForm = ({ initialData, onSubmit, categories, isSubmitting = false }: PostFormProps) => {
  const editorRef = useRef<Editor>(null);
  const navigate = useNavigate();
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [category, setCategory] = useState(initialData?.categories_id || '');
  const [desc, setDesc] = useState(initialData?.desc || '');
  const [status, setStatus] = useState(initialData?.status || 'draft');
  const [images, setImages] = useState<(File | string)[]>(initialData?.images || []);

  const onUploadImage = async (blob: Blob | File, callback: (url: string, altText: string) => void) => {
    try {
      // Convert blob to File if needed
      const imageFile = blob instanceof File ? blob : new File([blob], 'image.png', { type: blob.type });
      
      // Create object URL for preview
      const imageUrl = URL.createObjectURL(imageFile);
      
      // Add the file to images state
      setImages(prev => [...prev, imageFile]);
      
      // Call the callback with the URL
      callback(imageUrl, 'Image');
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('categories_id', category);
    formData.append('desc', desc);
    formData.append('status', status);

    // Xử lý hình ảnh mới (File objects)
    const newImages = images.filter(img => img instanceof File);
    newImages.forEach(image => {
      if (image instanceof File) {
        formData.append('images', image);
        console.log('Adding image file:', image.name);
      }
    });
    
    // Xử lý hình ảnh hiện có (URLs) - chuyển thành JSON string
    const existingImages = images
      .filter(img => typeof img === 'string')
      .map(img => img as string);
    
    if (existingImages.length > 0) {
      formData.append('existingImages', JSON.stringify(existingImages));
      console.log('Existing images:', existingImages);
    }

    console.log('Form data prepared, submitting...');
    try {
      onSubmit(formData);
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files);
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả ngắn <span className="text-red-500">*</span>
              </label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Mô tả ngắn gọn về nội dung bài viết (tối đa 200 ký tự)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nội dung <span className="text-red-500">*</span>
              </label>
              <div className="border border-gray-300 rounded-md">
                <ToastEditor
                  initialValue={content || ''}
                  previewStyle="vertical"
                  height="400px"
                  initialEditType="wysiwyg"
                  useCommandShortcut={true}
                  hideModeSwitch={true}
                  ref={editorRef}
                  onChange={() => {
                    if (editorRef.current) {
                      const data = editorRef.current.getInstance().getHTML();
                      setContent(data);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Settings */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin bài viết</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.Cate_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái <span className="text-red-500">*</span>
                  </label>                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="published">Đã đăng</option>
                    <option value="draft">Nháp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hình ảnh <span className="text-red-500">*</span>
                  </label>
                  <ImageUploadPreview 
                    images={images}
                    onChange={handleImageChange}
                    onRemove={handleRemoveImage}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Có thể tải lên tối đa 5 hình ảnh cho bài viết
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/admin/posts')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                Huỷ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isSubmitting ? 'Đang xử lý...' : initialData ? 'Cập nhật' : 'Thêm bài viết'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
