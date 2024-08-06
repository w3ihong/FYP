'use client'
import React, { useEffect, useState } from "react";
import ComparisonModal from "@/components/comparativeModal";
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
    post_engagement_rate: number;
    date_retrieved: string;
  };
}

function analyzeBestTimes(posts: Post[]) {
  const timeEngagement: Record<number, {
    totalEngagement: number;
    totalComments: number;
    totalLikes: number;
    totalReach: number;
    count: number;
  }> = {};

  posts.forEach(post => {
    if (!post.metrics.date_retrieved) {
      console.error(`Missing date_retrieved for post ID: ${post.id}`);
      return;
    }

    const date = new Date(post.metrics.date_retrieved);
    if (isNaN(date.getTime())) {
      console.error(`Invalid date format: ${post.metrics.date_retrieved}`);
      return;
    }

    const utcHour = date.getUTCHours();
    const sgtHour = (utcHour + 8) % 24;

    if (!timeEngagement[sgtHour]) {
      timeEngagement[sgtHour] = {
        totalEngagement: 0,
        totalComments: 0,
        totalLikes: 0,
        totalReach: 0,
        count: 0,
      };
    }

    const { post_engagement_rate, post_comments, post_likes, post_reach } = post.metrics;

    timeEngagement[sgtHour].totalEngagement += post_engagement_rate;
    timeEngagement[sgtHour].totalComments += post_comments;
    timeEngagement[sgtHour].totalLikes += post_likes;
    timeEngagement[sgtHour].totalReach += post_reach;
    timeEngagement[sgtHour].count += 1;
  });

  const bestTimes = Object.keys(timeEngagement).map(hour => {
    const { totalEngagement, totalComments, totalLikes, totalReach, count } = timeEngagement[parseInt(hour)];
    return {
      hour: parseInt(hour),
      averageEngagement: totalEngagement / count,
      averageComments: totalComments / count,
      averageLikes: totalLikes / count,
      averageReach: totalReach / count,
    };
  });

  bestTimes.sort((a, b) => b.averageEngagement - a.averageEngagement);

  console.log("Best Times Analysis:", bestTimes);

  return bestTimes.slice(0, 5); 
}

function formatTime(hour: number) {
  const period = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${formattedHour}:00 ${period}`;
}

function BestTimesModal({ bestTimes, isOpen, onClose }: { bestTimes: { hour: number, averageEngagement: number, averageComments: number, averageLikes: number, averageReach: number }[], isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-3/4 max-w-md">
        <h2 className="text-2xl font-bold mb-4">Best Times to Post</h2>
        <ul>
          {bestTimes.map((time, index) => (
            <li key={index} className="mb-4">
              <div>{formatTime(time.hour)}:</div>
              <div>Avg. Engagement: {time.averageEngagement.toFixed(2)}</div>
              <div>Avg. Comments: {time.averageComments.toFixed(2)}</div>
              <div>Avg. Likes: {time.averageLikes.toFixed(2)}</div>
              <div>Avg. Reach: {time.averageReach.toFixed(2)}</div>
            </li>
          ))}
        </ul>
        <button className="bg-accent text-white px-4 py-2 rounded hover:bg-cyan-900 transition duration-200 mt-4" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function extractHashtags(caption: string): string[] {
  const hashtagRegex = /#\w+/g;
  const hashtags = caption.match(hashtagRegex);
  return hashtags ? hashtags.map(tag => tag.toLowerCase()) : [];
}

function getBestHashtags(posts: Post[]) {
  const hashtagEngagement: Record<string, {
    totalEngagement: number;
    count: number;
  }> = {};

  posts.forEach(post => {
    const hashtags = extractHashtags(post.caption);
    hashtags.forEach(tag => {
      if (!hashtagEngagement[tag]) {
        hashtagEngagement[tag] = {
          totalEngagement: 0,
          count: 0,
        };
      }
      hashtagEngagement[tag].totalEngagement += post.metrics.post_engagement_rate;
      hashtagEngagement[tag].count += 1;
    });
  });

  const sortedHashtags = Object.entries(hashtagEngagement)
    .map(([tag, { totalEngagement, count }]) => ({
      tag,
      averageEngagement: totalEngagement / count,
    }))
    .sort((a, b) => b.averageEngagement - a.averageEngagement)
    .map(entry => entry.tag);

  return sortedHashtags.slice(0, 10); 
}

function BestHashtagsModal({ bestHashtags, isOpen, onClose }: { bestHashtags: string[], isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-3/4 max-w-md">
        <h2 className="text-2xl font-bold mb-4">Best Hashtags to Use</h2>
        <div className="mb-4">
          {bestHashtags.map((hashtag, index) => (
            <span 
              key={index} 
              className="inline-block mb-2 mr-2 hover:text-lg transition-transform duration-200 ease-in-out transform hover:scale-105"
            >
              {hashtag}
            </span>
          ))}
        </div>
        <button className="bg-accent text-white px-4 py-2 rounded hover:bg-cyan-900 transition duration-200 mt-4" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}


export default function ComparePosts() {
  const [selectedPosts, setSelectedPosts] = useState<Post[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isBestTimesModalOpen, setBestTimesModalOpen] = useState(false); 
  const [isBestHashtagsModalOpen, setBestHashtagsModalOpen] = useState(false);
  const [bestHashtags, setBestHashtags] = useState<string[]>([]);
  const [bestTimes, setBestTimes] = useState<{ hour: number, averageEngagement: number, averageComments: number, averageLikes: number, averageReach: number }[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  useEffect(() => {
    async function fetchData() {
      try {
        const postsWithMetrics = await getPostsWithMetrics();
        console.log("Posts with Metrics:", postsWithMetrics); // Debug log

        setPosts(postsWithMetrics);
        setBestTimes(analyzeBestTimes(postsWithMetrics));
        setBestHashtags(getBestHashtags(postsWithMetrics));
      } catch (error) {
        console.error("Error fetching posts with metrics:", error);
      }
    }

    fetchData();
  }, []);

  const handleSelectPost = (post: Post) => {
    let updatedPosts = [...selectedPosts];

    if (selectedPosts.some(selectedPost => selectedPost.id === post.id)) {
      updatedPosts = updatedPosts.filter(selectedPost => selectedPost.id !== post.id);
    } else {
      if (selectedPosts.length < 2) {
        updatedPosts.push(post);
      } else {
        updatedPosts = [selectedPosts[1], post];
      }
    }

    setSelectedPosts(updatedPosts);

    if (updatedPosts.length === 2) {
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPosts([]);
  };

  const filteredPosts = selectedPlatform === 'all'
    ? posts
    : posts.filter(post => post.platform.toLowerCase() === selectedPlatform);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-accent">Compare Posts</h1>
        <div className="flex items-center space-x-4">
          <button
            className="bg-white text-black px-4 py-2 rounded shadow hover:bg-gray-100 transition-transform duration-200 transform hover:-translate-y-1"
            onClick={() => setBestTimesModalOpen(true)}
          >
            Best Times to Post
          </button>
          <button
            className="bg-white text-black px-4 py-2 rounded shadow hover:bg-gray-100 transition-transform duration-200 transform hover:-translate-y-1"
            onClick={() => setBestHashtagsModalOpen(true)}
          >
            Best Hashtags
          </button>
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="border border-0 shadow p-2 rounded transition-transform duration-200 transform hover:-translate-y-1"
          >
            <option value="all">All Platforms</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
          </select>
        </div>
      </div>
      <p className="text-sm text-gray-600">Select two posts to compare their metrics</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-3">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className={`bg-white rounded-md shadow-md p-3 cursor-pointer transform transition duration-300 ease-in-out hover:scale-105 ${
              selectedPosts.some(selectedPost => selectedPost.id === post.id) ? 'border-4 border-gray-500' : ''
            }`}
            onClick={() => handleSelectPost(post)}
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
      <ComparisonModal posts={selectedPosts} isOpen={isModalOpen} onClose={handleCloseModal} />
      <BestTimesModal bestTimes={bestTimes} isOpen={isBestTimesModalOpen} onClose={() => setBestTimesModalOpen(false)} />
      <BestHashtagsModal bestHashtags={bestHashtags} isOpen={isBestHashtagsModalOpen} onClose={() => setBestHashtagsModalOpen(false)} />
    </div>
  );
}
