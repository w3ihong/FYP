'use client';

import { useEffect, useState } from 'react';
import { getPostsWithSentiment } from '@/app/actions'; // Adjust the path as needed
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faArrowDown } from '@fortawesome/free-solid-svg-icons';

type SortOrder = 'asc' | 'desc';

interface PostMetrics {
  sentiment_emoji: string;
  post_sentiment: string;
  date_retrieved: string;
  post_likes: number;
  post_impressions: number;
}

interface Post {
  id: string;
  caption: string;
  post_type: 'IMAGE' | 'VIDEO';
  media_url: string;
  permalink: string;
  post_metrics?: PostMetrics[];
}

const Dashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const fetchData = async (order: SortOrder, start?: string, end?: string) => {
    try {
      // Fetch posts with sentiment
      const postsWithSentiment = await getPostsWithSentiment(order, start, end);

      if (!postsWithSentiment) {
        setError('Error fetching posts with sentiment');
        setLoading(false);
        return;
      }

      setPosts(postsWithSentiment);
      setLoading(false);
    } catch (error) {
      console.error('Fetch error:', error);
      setError((error as Error).message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(sortOrder, startDate, endDate);
  }, [sortOrder, startDate, endDate]);

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'startDate') setStartDate(value);
    if (name === 'endDate') setEndDate(value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-4">
        <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
        <button
          onClick={toggleSortOrder}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Toggle Sort Order ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
        </button>
        <div className="mb-4">
          <label className="mr-2">Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={startDate}
            onChange={handleDateChange}
            className="border p-2 rounded"
          />
          <label className="ml-4 mr-2">End Date:</label>
          <input
            type="date"
            name="endDate"
            value={endDate}
            onChange={handleDateChange}
            className="border p-2 rounded"
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {posts.map(post => {
            const sentimentEmoji = post.post_metrics?.[0]?.sentiment_emoji || '';
            const captionWithEmoji = `${post.caption} ${sentimentEmoji}`;

            return (
              <div key={post.id} className="border p-4 rounded">
                <div className="h-48 w-full bg-gray-200 mb-2 rounded overflow-hidden">
                  {post.post_type === 'VIDEO' ? (
                    <video className="w-full h-full object-cover" controls>
                      <source src={post.media_url} type="video/mp4" />
                    </video>
                  ) : (
                    <img src={post.media_url} alt={post.caption} className="w-full h-full object-cover" />
                  )}
                </div>
                
                <p className="mb-2">{captionWithEmoji}</p>
                <p className="text-gray-600">
                  Sentiment: {sentimentEmoji || 'N/A'} ({post.post_metrics?.[0]?.post_sentiment || 'N/A'})
                </p>
                <p className="text-gray-600">Date: {post.post_metrics?.[0]?.date_retrieved || 'N/A'}</p>
                <p className="text-gray-600">
                  <span className="mr-2">
                    <FontAwesomeIcon icon={faHeart} /> {post.post_metrics?.[0]?.post_likes || 'N/A'}
                  </span>
                  <span>
                    <FontAwesomeIcon icon={faArrowDown} /> {post.post_metrics?.[0]?.post_impressions || 'N/A'}
                  </span>
                </p>
                <a href={post.permalink} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  View Post
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
