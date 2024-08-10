'use client';

import { useEffect, useState } from 'react';
import LineGraph from '@/components/lineGraph';
import BarGraph from '@/components/barChart';
import PieChart from '@/components/pieChart';
import TotalStatsCard from '@/components/totalStatsCard';
import { getPlatformMetricDatesTwo } from '@/app/actions'; // Import the updated method

const Dashboard = () => {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null); // State for selected account
  const [accounts, setAccounts] = useState<{ id: string; name: string }[]>([]); // State for account options

  useEffect(() => {
    // Fetch account options for the dropdown
    const fetchAccounts = async () => {
      // Replace with your logic to fetch account options
      // Example: const { data, error } = await supabase.from('accounts').select('*');
      const accountOptions = [
        { id: '17841466917978018', name: 'Account 1' },
        { id: '12345678901234567', name: 'Account 2' }
      ]; // Example data
      setAccounts(accountOptions);
      setSelectedAccount(accountOptions[0]?.id || null); // Set default selected account
    };

    fetchAccounts();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedAccount) {
        try {
          // Fetch metrics data using the combined method with the selected account
          const data = await getPlatformMetricDatesTwo(selectedAccount, null, null);

          // Separate the combined data into post metrics and platform metrics
          const postMetrics = data.filter((item: any) => item.date_retrieved && item.post_likes !== undefined);
          const platformMetricsData = data.find((item: any) => item.platform_followers !== undefined) || {};

          setMetrics(postMetrics);

          // If there's only one set of platform metrics
          if (Object.keys(platformMetricsData).length) {
            const { platform_followers = 0, platform_likes = 0, platform_comments = 0, platform_saves = 0, platform_shares = 0 } = platformMetricsData;
            setMetrics(prevMetrics => [...prevMetrics, {
              platform_followers,
              platform_likes,
              platform_comments,
              platform_saves,
              platform_shares
            }]);
          }

          setLoading(false);
        } catch (error) {
          console.error('Fetch error:', error);
          setError((error as Error).message);
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [selectedAccount]); // Refetch data when selectedAccount changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const totalStats = metrics.find((item: any) => item.platform_followers !== undefined) || {};
  const postMetrics = metrics.filter((item: any) => item.date_retrieved && item.post_likes !== undefined);

  const { platform_followers = 0, platform_likes = 0, platform_comments = 0, platform_saves = 0, platform_shares = 0 } = totalStats;

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <select
          value={selectedAccount || ''}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="p-2 border rounded"
        >
          {accounts.map(account => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </div>

      <div className="col-span-3">
        <TotalStatsCard
          followers={platform_followers}
          likes={platform_likes}
          shares={platform_shares}
          comments={platform_comments}
          saved={platform_saves}
        />
      </div>
      <div className="col-span-1">
        <LineGraph 
          data={postMetrics} 
          metric="post_likes" 
          color="rgba(75, 192, 192, 1)" 
          label="Post Likes Over Time"
          title="Post Likes Over Time"
        />
      </div>
      <div className="col-span-1">
        <LineGraph 
          data={postMetrics} 
          metric="post_shares" 
          color="rgba(153, 102, 255, 1)" 
          label="Post Shares Over Time"
          title="Post Shares Over Time"
        />
      </div>
      <div className="col-span-1">
        <LineGraph 
          data={postMetrics} 
          metric="post_comments" 
          color="rgba(255, 159, 64, 1)" 
          label="Post Comments Over Time"
          title="Post Comments Over Time"
        />
      </div>
      <div className="col-span-1">
        <LineGraph 
          data={postMetrics} 
          metric="post_impressions" 
          color="rgba(54, 162, 235, 1)" 
          label="Post Impressions Over Time"
          title="Post Impressions Over Time"
        />
      </div>
      <div className="col-span-1">
        <BarGraph
          data={postMetrics}
          metrics={['post_likes', 'post_shares', 'post_comments']}
          colors={['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)']}
          label="Likes, Shares, and Comments"
          title="Likes, Shares, and Comments Comparison"
        />
      </div>
      <div className="col-span-1">
        <BarGraph
          data={postMetrics}
          metrics={['post_engagement_rate']}
          colors={['rgba(255, 206, 86, 0.6)']}
          label="Engagement Rate"
          title="Engagement Rate Comparison"
        />
      </div>
      <div className="col-span-1">
        <PieChart
          data={postMetrics}
          metrics={['post_likes', 'post_shares', 'post_comments']}
          colors={['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)']}
          title="Distribution of Different Interactions"
        />
      </div>

      <LineGraph
  data={postMetrics}
  metric="post_sentiment"
  color="rgba(255, 99, 132, 1)"
  label="Post Sentiment  Over Time"
  title="Post Sentiment Rate Over Time"
/>

<LineGraph
  data={postMetrics}
  metric="post_profile_visits"
  color="rgba(255, 99, 132, 1)"
  label="Post Profile visits  Over Time"
  title="Post Profile vists  Over Time"
/>



    </>
  );
};

export default Dashboard;
