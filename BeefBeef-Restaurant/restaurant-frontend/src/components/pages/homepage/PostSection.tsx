import React from "react";
import PostCard from "../../common/PostCard";

interface Post {
  badgeText: string;
  title: string;
  category: string;
  description: string;
  image: string;
}

interface PostSectionProps {
  posts: Post[];
}

const PostSection: React.FC<PostSectionProps> = ({ posts }) => {
  return (
    <section className="w-full bg-bodyBackground py-16">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-restora text-center text-white font-thin mb-8">
        News & Events
      </h2>
      <div className="overflow-hidden">
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-6 hide-scrollbar">
            {posts.map((post, index) => (
            <div
                key={index}
                className="flex-shrink-0 w-[85%] sm:w-[70%] md:w-[50%] xl:w-[32%] snap-center"
            >
                <PostCard {...post} />
            </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default PostSection;