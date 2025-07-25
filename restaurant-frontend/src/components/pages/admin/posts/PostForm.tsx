import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploadPreview from '../ImageUploadPreview';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor as ToastEditor } from '@toast-ui/react-editor';
import PostPreviewModal from './PostPreviewModal';
import { PostType } from '@/types/PostType';

interface PostFormProps {
  initialData?: {
    title: string;
    content: string;
    images: string[];
    categories_id: string;
    desc: string;
    status: string;
    tags: string[];
    scheduledAt?: string;
  };
  onSubmit: (formData: FormData) => void;
  categories: { _id: string; Cate_name: string }[];
  isSubmitting?: boolean;
}

const TAG_OPTIONS = [
  'Món chính',
  'Món khác',
  'Khai vị',
  'Món phụ và ăn kèm',
  'Nước uống',
  'Món tráng miệng',
  'Đồ uống có cồn',
  'Tin tức',
];

const PostForm = ({ initialData, onSubmit, categories, isSubmitting = false }: PostFormProps) => {
  const editorRef = useRef<ToastEditor>(null);
  const navigate = useNavigate();

  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [category, setCategory] = useState(initialData?.categories_id || '');
  const [desc, setDesc] = useState(initialData?.desc || '');
  const [status, setStatus] = useState(initialData?.status || 'draft');
  const [images, setImages] = useState<(File | string)[]>(initialData?.images || []);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tags || []);
  const [scheduledAt, setScheduledAt] = useState(initialData?.scheduledAt || '');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewPost, setPreviewPost] = useState<any>(null);
  const [tagInput, setTagInput] = useState('');

  const onUploadImage = async (blob: Blob | File, callback: (url: string, altText: string) => void) => {
    try {
      const imageFile = blob instanceof File ? blob : new File([blob], 'image.png', { type: blob.type });
      const imageUrl = URL.createObjectURL(imageFile);
      setImages(prev => [...prev, imageFile]);
      callback(imageUrl, 'Image');
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handlePreview = () => {
    const tempImages: string[] = images.map(img => img instanceof File ? URL.createObjectURL(img) : img);
    const mockPost: PostType = {
      _id: 'preview',
      title: title || 'Tiêu đề xem trước',
      slug: '',
      desc: desc || 'Mô tả xem trước',
      content: content || 'Nội dung xem trước',
      images: tempImages,
      categories_id: categories.find(cat => cat._id === category) || {
        _id: '',
        Cate_name: 'Chưa chọn danh mục',
        Cate_slug: '',
        Cate_img: '',
        Cate_type: '',
      },
      user_id: { _id: 'admin', username: 'Admin', email: '', avatar: '' },
      views: 0,
      likes: 0,
      likedBy: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: status as 'draft' | 'published',
      tags: selectedTags.length > 0 ? selectedTags : ['Chưa có thẻ nào'],
    };
    setPreviewPost(mockPost);
    setShowPreviewModal(true);
  };

  const handleTagChange = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
      setSelectedTags(prev => Array.from(new Set([...prev, ...tags])));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Gom tagInput vào mảng tạm thời, không dùng setState ở đây
    let tagsToSubmit = selectedTags;
    if (tagInput.trim()) {
      const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
      tagsToSubmit = Array.from(new Set([...selectedTags, ...tags]));
    }
    if (tagsToSubmit.length === 0) {
      alert('Vui lòng nhập ít nhất một thẻ (tag) cho bài viết!');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('categories_id', category);
    formData.append('desc', desc);
    formData.append('status', status);
    formData.append('tags', tagsToSubmit.join(','));
    if (scheduledAt) {
      formData.append('scheduledAt', scheduledAt);
    }

    const newImages = images.filter(img => img instanceof File);
    newImages.forEach(image => {
      if (image instanceof File) {
        formData.append('images', image);
      }
    });

    const existingImages = images.filter(img => typeof img === 'string') as string[];
    if (existingImages.length > 0) {
      formData.append('existingImages', JSON.stringify(existingImages));
    }

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
      <form onSubmit={handleSubmit} className=" space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-[40px] p-3 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder='Nhập tiêu đề'
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn <span className="text-red-500">*</span></label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                required
                placeholder='Nhâp mô tả'
              />
              <p className="mt-1 text-sm text-gray-500">Mô tả ngắn gọn về nội dung bài viết (tối đa 200 ký tự)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung <span className="text-red-500">*</span></label>
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

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Thông tin bài viết</h3>
                <button
                  type="button"
                  onClick={handlePreview}
                  className="p-2 rounded-md hover:bg-gray-200 transition"
                  title="Xem trước bài viết"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4.5C7.305 4.5 3.302 7.918 2 12c1.302 4.082 5.305 7.5 10 7.5s8.698-3.418 10-7.5c-1.302-4.082-5.305-7.5-10-7.5zm0 12a4.5 4.5 0 110-9 4.5 4.5 0 010 9z" />
                    <circle cx="12" cy="12" r="2.5" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục <span className="text-red-500">*</span></label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.Cate_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái <span className="text-red-500">*</span></label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="published">Xuất bản</option>
                    <option value="draft">Nháp</option>
                    <option value="pending">Lên lịch đăng bài</option>
                  </select>
                </div>

                {status === 'pending' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian xuất bản</label>
                    <input
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(e) => {
                        setScheduledAt(e.target.value);
                        if (e.target.value) setStatus('pending');
                      }}
                      className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

                {/* Thẻ bài viết (Tag) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thẻ bài viết (Tag) <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder="Nhập tag, ngăn cách bằng dấu phẩy (,)"
                    className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-gray-500 focus:border-blue-500"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedTags.map((tag) => (
                      <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1">
                        {tag}
                        <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 text-red-500">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <ImageUploadPreview images={images} onChange={handleImageChange} onRemove={handleRemoveImage} />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/admin/posts')}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Huỷ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-md text-sm text-white ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                {isSubmitting ? 'Đang xử lý...' : initialData ? 'Cập nhật' : 'Thêm bài viết'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {showPreviewModal && previewPost && (
        <PostPreviewModal isOpen={showPreviewModal} onClose={() => setShowPreviewModal(false)} post={previewPost} />
      )}
    </div>
  );
};

export default PostForm;
