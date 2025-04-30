// pages/BlogPage.tsx
import React from 'react';

import { PostType } from '../types/PostType';

import PostListSection from '../components/pages/posts/PostListSection';
import PostSidebar from '../components/pages/posts/PostSidebar';
import BreadCrumbComponents from '../components/common/BreadCrumbComponents';

const mockPosts: PostType[] = [
  {
    id: '1',
    title: 'Món beef stack của nhà hàng chúng tôi',
    image: '../../public/assets/images/posts/Post.jpg',
    date: '2022-02-18',
    description: 'Thực phẩm theo mùa cung cấp nhiều loại trái cây...',
    author: 'Tin tức',
    category: 'Healthy Food',
  },
  {
    id: '2',
    title: 'Không gian của nhà hàng chúng tôi',
    image: '../../public/assets/images/posts/Post_2.png',
    date: '2022-05-18',
    description: 'Khung cảnh được thiết lập cho mọi dịp...',
    author: 'News',
    category: 'Healthy Food',
  },
  {
    id: '3',
    title: 'Không gian của nhà hàng chúng tôi',
    image: '../../public/assets/images/posts/Post_2.png',
    date: '2022-05-18',
    description: 'Khung cảnh được thiết lập cho mọi dịp...',
    author: 'News',
    category: 'Healthy Food',
  },
  {
    id: '4',
    title: 'Không gian của nhà hàng chúng tôi',
    image: '../../public/assets/images/posts/Post_2.png',
    date: '2022-05-18',
    description: 'Khung cảnh được thiết lập cho mọi dịp...',
    author: 'News',
    category: 'Healthy Food',
  },
];

const PostPage: React.FC = () => {
  return (
    <>
      <BreadCrumbComponents />

      <div className="flex py-10 bg-bodyBackground min-h-auto text-white">
        <div className="w-11/12 md:w-container95 lg:w-container95 xl:w-container95 2xl:w-mainContainer mx-auto">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="w-full lg:w-1/4">
              <PostSidebar />
            </div>

            <div className="w-full lg:w-3/4">
              <PostListSection posts={mockPosts} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostPage;
