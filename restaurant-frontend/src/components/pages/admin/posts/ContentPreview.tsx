import React, { useState } from 'react';
import {
    FaShareAlt,
    FaFacebookF,
    FaTwitter,
    FaUser,
    FaHeart,
} from 'react-icons/fa';
import { IoList } from 'react-icons/io5';
import { MdOutlineAccessTime } from 'react-icons/md';
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { PiEyesDuotone } from "react-icons/pi";
import ButtonComponents from '@/components/common/ButtonComponents';
import { PostType } from '@/types/PostType';
import { usePostById } from '@/hooks/usePosts';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ReportModal from '@/components/common/modals/ReportModal';
import PostReportApi from '@/api/PostReportApi';
import Cookies from 'js-cookie';


interface PostContentProps {
    post: PostType;
}

const DEFAULT_TAGS = [
    'Món chính',
    'Món khác',
    'Khai vị',
    'Món phụ và ăn kèm',
    'Nước uống',
    'Món tráng miệng',
    'Đồ uống có cồn'
];

export const isAuthenticated = (): boolean => {
    const userInfo = Cookies.get('userInfo');
    return !!userInfo;
};

const ContentPreview: React.FC<PostContentProps> = ({ post }) => {
    // const { isAuthenticated } = useAuth();
    const { isLiked, likesCount, toggleLike } = usePostById(post._id);
    const navigate = useNavigate();
    const [showReportModal, setShowReportModal] = useState(false); // State for report modal
    const tags = post.tags && post.tags.length > 0 ? post.tags : DEFAULT_TAGS;
    console.log(tags);

    const handleTagClick = (tag: string) => {
        console.log(`/posts/tag/${encodeURIComponent(tag)}`);
        navigate(`/posts/tag/${encodeURIComponent(tag)}`);
    };

    return (
        <section className="bg-[#012B40] text-white lg:py-16 px-6">
            <div className="max-w-full lg:max-w-4xl mx-auto px-4 sm:px-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-4 break-words">{post.title}</h1>

                {/* Hình ảnh */}
                <div className="mb-6">
                    {post.images && post.images.length > 0 && (
                        <div className="flex justify-center">
                            <img
                                src={post.images[0]}
                                alt={post.title}
                                className="rounded-lg shadow-lg w-full h-auto max-w-[800px] object-cover"
                            />
                        </div>
                    )}
                    {post.images && post.images.length > 1 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                            {post.images.slice(1).map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`${post.title} - ${index + 2}`}
                                    className="rounded-lg shadow-lg w-full h-48 object-cover"
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Nội dung */}
                <div className="text-base sm:text-lg max-w-none mb-12 overflow-hidden break-words whitespace-pre-line">
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>

                {/* Thẻ tags - render động và có sự kiện chuyển trang */}
                <div className="mb-10 text-right">
                    <span className="font-semibold mr-2 text-sm">Thẻ:</span>
                    {tags.map((tag: string, idx: number) => (
                        <button
                            key={idx}
                            className="bg-gray-100 text-black px-2 py-0.5 text-xs rounded mr-2 mb-1"
                            onClick={() => handleTagClick(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

            </div>

        </section>
    );
};

export default ContentPreview;
