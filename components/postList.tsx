'use client'
import React, { useEffect, useState } from "react";
import { getPostsWithMetrics } from "@/app/actions"; 

interface Post {
  id: string;
  created_at: string;
  post_type: string;
  platform_account: string;
  caption: string;
  media_url: string;
  permalink: string;
  video_thumbnail: string;
  platform: string;
  metrics: {
    post_comments: number;
    post_likes: number;
    post_shares: number;
    post_impressions: number;
    post_saved: number;
    post_reach: number;
  };
}

interface PostListProps {
  selectedPosts: Post[];
  onSelectPost: (post: Post) => void;
  posts: Post[];
}

const PostList: React.FC<PostListProps> = ({ selectedPosts, onSelectPost }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await getPostsWithMetrics();
      setPosts(response);
    };
    fetchPosts();
  }, []);

  const filteredPosts = selectedPlatform === 'all'
    ? posts
    : posts.filter(post => post.platform.toLowerCase() === selectedPlatform);

  const isSelected = (post: Post) => selectedPosts.some(selectedPost => selectedPost.id === post.id);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <select
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All Platforms</option>
          <option value="instagram">Instagram</option>
          <option value="facebook">Facebook</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-3">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className={`bg-white rounded-md shadow-md p-3 cursor-pointer transform transition duration-300 ease-in-out hover:scale-105 ${
              isSelected(post) ? 'border-4 border-gray-500' : ''
            }`}
            onClick={() => onSelectPost(post)}
          >
            <div className="aspect-square overflow-hidden">
              {post.post_type === 'VIDEO' ? (
                <img src={post.video_thumbnail} alt="" className="w-full h-full object-cover" />
              ) : (
                <img src={post.media_url} alt="" className="w-full h-full object-cover" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;
