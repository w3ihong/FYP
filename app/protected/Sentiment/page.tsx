'use client';

import { useEffect, useState } from 'react';
import { getPostsWithSentiment, planType } from '@/app/actions'; // Adjust the path as needed
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import DatePicker, { DateRangeType } from 'react-tailwindcss-datepicker';
import { format } from 'date-fns';

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
  created_at: string;
  platform: string;
}

const Dashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [userPlanType, setUserPlanType] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRangeType>({ startDate: null, endDate: null });

  const fetchData = async (order: SortOrder, start?: string, end?: string) => {
    try {
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
    const start = dateRange.startDate ? format(new Date(dateRange.startDate), 'yyyy-MM-dd') : '';
    const end = dateRange.endDate ? format(new Date(dateRange.endDate), 'yyyy-MM-dd') : '';
    fetchData(sortOrder, start, end);
  }, [sortOrder, dateRange]);

  useEffect(() => {
    const checkPlanType = async () => {
      const type = await planType();
      setUserPlanType(type);
    };
    
    checkPlanType();
  }, []);

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const handleDateChange = (newRange: DateRangeType) => {
    setDateRange(newRange);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const filteredPosts = posts.filter(post => {
    const postDate = new Date(post.created_at);
    const startDate = dateRange.startDate ? new Date(dateRange.startDate) : null;
    const endDate = dateRange.endDate ? new Date(dateRange.endDate) : null;

    if (startDate && postDate < startDate) return false;
    if (endDate && postDate > endDate) return false;

    return true;
  });

  return (
    <div className={`grid grid-cols-4 gap-4 ${userPlanType !== 'premium' ? 'blurred' : ''}`}>
      <div className="col-span-4">
        <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
        <div className="flex justify-end items-center mb-4">
          <button
            onClick={toggleSortOrder}
            className="px-4 py-2 bg-accent shadow text-white rounded mr-4"
          >
            Toggle Sort Order ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
          </button>
          <div className="w-60">
          <DatePicker
            value={dateRange}
            onChange={handleDateChange}
            displayFormat="MM/DD/YYYY"
            placeholder="Select Date Range"
            useRange={false}
          />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {filteredPosts.map(post => {
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

