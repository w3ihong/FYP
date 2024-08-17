'use client';

import { useEffect, useState } from 'react';
import { getPostsMetrics, getAccounts, fetchUserName} from '@/app/actions'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart ,faExternalLink, faFrown, faMeh, faSmile, faComment,faBookmark, faShare} from '@fortawesome/free-solid-svg-icons';
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import LineChart from '@/components/lineChart';
import { planType } from '@/app/actions'; 
import Modal from '@/components/bigModalContainer';
import Link from 'next/link';
import DatePicker, { DateRangeType } from 'react-tailwindcss-datepicker';
import { format } from 'date-fns';




type SortOrder = 'asc' | 'desc';

interface PostMetrics {
  post_id: string;
  post_likes: number;
  post_shares: number;
  post_saved: number;
  post_comments: number;
  post_impressions: number;
  post_reach: number;
  post_profile_visits: number;
  post_virality_rate: number;
  post_amplification_rate: number;
  post_engagement_rate: number;
  post_sentiment: number;
  date_retrieved: string;
  post_video_views: number;
}

interface Post {
  id: string;
  created_at: string;
  post_type: 'IMAGE' | 'VIDEO';
  caption: string;
  media_url: string;
  permalink: string;
  post_metrics?: PostMetrics[];
}

const Dashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [dateRange, setDateRange] = useState<DateRangeType>({ startDate: null, endDate: null });
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [userPlanType, setUserPlanType] = useState<string | null>(null); // State for plan_type
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);
  const [accounts, setAccounts] = useState<{ id: number; account_username: string ; platform: string; picture_url: string}[]>([]); // the social accounts name
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [postMetrics, setPostMetrics] = useState<PostMetrics[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpenPremium, setIsModalOpenPremium] = useState(false); // State to handle modal visibility

  const dates = postMetrics.map(item => new Date(item.date_retrieved).toLocaleDateString());
  
  const visitsData = postMetrics.map(item => item.post_profile_visits);
  const likesData = postMetrics.map(item => item.post_likes);
  const savesData = postMetrics.map(item => item.post_saved);
  const reachData = postMetrics.map(item => item.post_reach);
  const sharesData = postMetrics.map(item => item.post_shares);
  const impressionData = postMetrics.map(item => item.post_impressions);
  const viralityData = postMetrics.map(item => item.post_virality_rate);
  const engagementData = postMetrics.map(item => item.post_engagement_rate);
  const sentimentData = postMetrics.map(item => item.post_sentiment);



  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Fetch user data
        const userData = await fetchUserName();
        if (userData) {
  
          // Fetch accounts for the user
          const accountsData = await getAccounts(userData.user_id);
          console.log(accountsData);
          if (accountsData.length > 0) {
            setHasAccount(true);
  
            // Map the accountsData to match the expected structure
            const formattedAccounts = accountsData.map(account => ({
              id: account.platform_account_id,
              account_username: account.account_username,
              platform: account.platform,
              picture_url: account.profile_picture_url,
            }));
  
            setAccounts(formattedAccounts);
            return;
          }
          return;
        }
  
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    initialize();
  }, []);


  const fetchData = async (id:number, order: SortOrder, start?: string, end?: string) => {
    try {
      // Fetch posts with sentiment
      const postsData = await getPostsMetrics(id, order, start, end);

      if (!postsData) {
        setError('Error fetching posts with sentiment');
        setLoading(false);
        return;
      }

      const sortedPostsList = postsData?.map((post: Post) => ({
        ...post,
        post_metrics: post.post_metrics.sort(
          (a, b) => new Date(a.date_retrieved).getTime() - new Date(b.date_retrieved).getTime()
        ),
      }));
    

      setPosts(sortedPostsList);
      setLoading(false);
    } catch (error) {
      console.error('Fetch error:', error);
      setError((error as Error).message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedAccountId,sortOrder, startDate, endDate);
  }, [selectedAccountId, sortOrder, startDate, endDate]);


  useEffect(() => {
    const start = dateRange.startDate ? format(new Date(dateRange.startDate), 'yyyy-MM-dd') : '';
    const end = dateRange.endDate ? format(new Date(dateRange.endDate), 'yyyy-MM-dd') : '';
    if (selectedAccountId) {
      fetchData(selectedAccountId, sortOrder, start, end);
    }
  }, [selectedAccountId, sortOrder, dateRange]);

  useEffect(() => {
    const checkPlanType = async () => {
      const type = await planType();
      console.log('Plan Type:', type);
      setUserPlanType(type);

       // Trigger modal if user is not premium
       if (type !== 'premium') {
        setIsModalOpenPremium(true);
    }

      

    };
    
    checkPlanType();
  }, []);

  



  const toggleSortOrder = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };
  
  const getSentimentIcon = (sentiment) => {
    if (sentiment > 0.5) return <FontAwesomeIcon icon={faSmile} className='text-green-400'/>; // Happy
    if (sentiment < -0.5) return <FontAwesomeIcon icon={faFrown} className='text-red-500'/>; // Sad
    return <FontAwesomeIcon icon={faMeh} className='text-yellow-300'/>; // Neutral
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'startDate') setStartDate(value);
    if (name === 'endDate') setEndDate(value);
  };

  const handleDateRangeChange = (range: DateRangeType) => {
    setDateRange(range);
  };


  const handleAccountSelect = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const accountId = Number(event.target.value);
    setSelectedAccountId(accountId);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {/* Overlay that covers the whole page when user is not premium */}
      {isModalOpenPremium && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 z-0 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center justify-center ">
          <InformationCircleIcon className="w-12 h-12 mb-4 text-gray-400" />
            <h2 className="text-xl font-bold mb-4 text-center">Upgrade to Premium</h2>
            
            <p className="mb-4 text-center">You need a premium account to access this feature.</p>
            
            <Link href="/settings/billing" className="bg-accent text-white px-4 py-2 rounded shadow">
               Upgrade to Premium
              
            </Link>
          </div>
        </div>
      )}
  
      <div className={`p-6 ${userPlanType !== 'premium' ? 'blurred' : ''}`}>
  
        <h2 className="text-2xl font-semibold">Post Analytics</h2>
        <p className="text-gray-600 mb-4">
          View analytics for your posts. Sort by date and filter by start and end date.
        </p>
        <div className="bg-white p-4 rounded shadow flex mb-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <p className=''>Sort:</p>
            <button
              onClick={toggleSortOrder}
              className="h-9 w-24 bg-accent text-white rounded"
            >
              {sortOrder === 'asc' ? 'Oldest' : 'Newest'}
            </button>
            <div className="w-60 ml-4">
              <DatePicker
                value={dateRange}
                onChange={handleDateRangeChange}
                displayFormat="DD/MM/YYYY"
                placeholder="Select date range"
                showShortcuts={true}
                asSingle={false}
                useRange={false}
                inputClassName="rounded h-9 w-full"
              />
            </div>
          </div>
          <div className="">
            <select className="rounded-md w-48 h-10 bg-accent text-white" onChange={handleAccountSelect} value={selectedAccountId || ''}>
              <option value="" disabled>Select an account</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.account_username}
                </option>
              ))}
            </select>
          </div>
        </div>
  
        <div className="">
          {hasAccount ? (
            selectedAccountId ? (
              posts.length > 0 ? (
                <div className="grid grid-cols-4 gap-4">
                  {posts.map(post => {
                    const caption = `${post.caption}`;
                    const formattedDate = formatDate(post.created_at);
                    const sentimentIcon = getSentimentIcon(post.post_metrics?.[post.post_metrics.length - 1]?.post_sentiment);
  
                    return (
                      <div key={post.id} className="border p-4 rounded bg-white hover:scale-105 transition-transform duration-300 shadow" 
                          onClick={() => { openModal(); setPostMetrics(post.post_metrics); setSelectedPost(post) }}>
                        
                        <div className="h-[14rem] w-full bg-white mb-4 rounded overflow-hidden">
                          {post.post_type === 'VIDEO' ? (
                            <video className="w-full h-full object-cover" controls>
                              <source src={post.media_url} type="video/mp4" />
                            </video>
                          ) : (
                            <img src={post.media_url} alt={post.caption} className="w-full h-full object-cover" />
                          )}
                        </div>
                        
                        <p className="h-[10rem] overflow-auto mb-4">{caption}</p>
                        <p className="text-gray-600">
                          Sentiment: {sentimentIcon}
                        </p>
                        <p className="text-gray-600">Date posted: {formattedDate}</p>
                        <div className='flex justify-between mt-2'>
                          <p className="text-gray-600 gap-2 flex">
                            <span className="">
                              <FontAwesomeIcon icon={faHeart} /> {post.post_metrics?.[post.post_metrics.length - 1]?.post_likes}
                            </span>
                            <span>
                              <FontAwesomeIcon icon={faBookmark} /> {post.post_metrics?.[post.post_metrics.length - 1]?.post_saved}
                            </span>
                            <span>
                              <FontAwesomeIcon icon={faComment} /> {post.post_metrics?.[post.post_metrics.length - 1]?.post_comments}
                            </span>
                            <span>
                              <FontAwesomeIcon icon={faShare} /> {post.post_metrics?.[post.post_metrics.length - 1]?.post_shares}
                            </span>
                          </p>
                          <Link href={post.permalink} target="_blank" rel="noopener noreferrer" className="text-gray-600">
                            <FontAwesomeIcon icon={faExternalLink} />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-80 w-full">
                  <InformationCircleIcon className="w-12 h-12 mb-4 text-gray-400" />
                  <p className="text-lg font-bold text-center text-gray-600">No posts found.</p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-80 w-full">
                <InformationCircleIcon className="w-12 h-12 mb-4 text-gray-400" />
                <p className="text-lg font-bold text-center text-gray-600">Select an account to view performance metrics.</p>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-80 w-full">
              <InformationCircleIcon className="w-12 h-12 mb-4 text-gray-400" />
              <p className="text-lg font-bold text-center text-gray-600">Connect to an account first.</p>
            </div>
          )}
  
        </div>
  
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {selectedPost ? (
            <div className="w-full h-full flex gap-2">
              {/* post and latest metrics and comments */}
              <div className="h-full w-1/4">
                <div className="h-1/3 w-full bg-white mb-4 rounded overflow-hidden">
                  {selectedPost.post_type === 'VIDEO' ? (
                    <video className="w-full h-full object-cover" controls>
                      <source src={selectedPost.media_url} type="video/mp4" />
                    </video>
                  ) : (
                    <img src={selectedPost.media_url} alt={selectedPost.caption} className="w-full h-full object-cover" />
                  )}
                </div>
                <p className="h-1/4 overflow-auto mb-2">{selectedPost.caption}</p>
                <p className="text-gray-600">
                  Sentiment: {getSentimentIcon(selectedPost.post_metrics?.[selectedPost.post_metrics.length - 1]?.post_sentiment)}
                </p>
                <p className="text-gray-600">Date posted: {formatDate(selectedPost.created_at)}</p>
                <div className='flex justify-between mt-2'>
                  <p className="text-gray-600 gap-2 flex">
                    <span className="">
                      <FontAwesomeIcon icon={faHeart} /> {selectedPost.post_metrics?.[selectedPost.post_metrics.length - 1]?.post_likes}
                    </span>
                    <span>
                      <FontAwesomeIcon icon={faBookmark} /> {selectedPost.post_metrics?.[selectedPost.post_metrics.length - 1]?.post_saved}
                    </span>
                    <span>
                      <FontAwesomeIcon icon={faComment} /> {selectedPost.post_metrics?.[selectedPost.post_metrics.length - 1]?.post_comments}
                    </span>
                    <span>
                      <FontAwesomeIcon icon={faShare} /> {selectedPost.post_metrics?.[selectedPost.post_metrics.length - 1]?.post_shares}
                    </span>
                  </p>
                  <Link href={selectedPost.permalink} target="_blank" rel="noopener noreferrer" className="text-gray-600">
                    <FontAwesomeIcon icon={faExternalLink} />
                  </Link>
                </div>
                {/* comments */}
                <div>
                  {/* Add comments section here if needed */}
                </div>
              </div>
              {/* post metrics */}
              <div className="h-full w-3/4 flex gap-2">
                <div className="h-full w-1/2  gap-2 overflow-auto">
                  <LineChart metricName="Post Likes" metricData={likesData} dates={dates} />
                  <LineChart metricName="Post Impressions" metricData={impressionData} dates={dates} />
                  <LineChart metricName="Post Engagements" metricData={engagementData} dates={dates} />
                  <LineChart metricName="Post Sentiemnt" metricData={sentimentData} dates={dates} />
              
                </div>
                <div className="h-full w-1/2 gap-2 overflow-auto">
                  <LineChart metricName="Post Shares" metricData={sharesData} dates={dates} />
                  <LineChart metricName="Post Virality Rate" metricData={viralityData} dates={dates} />
                  <LineChart metricName="Acount visits from post" metricData={visitsData} dates={dates} />
                  <LineChart metricName="Post Reach" metricData={reachData} dates={dates} />
                </div>
              </div>
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </Modal>
      </div>
    </>
  );
}

export default Dashboard;
