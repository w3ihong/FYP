'use client';

import { useEffect, useState } from 'react';
import LineGraph from '@/components/lineGraph';
import BarGraph from '@/components/barChart';
import PieChart from '@/components/pieChart';
import TotalStatsCard from '@/components/totalStatsCard';
import { getPlatformMetricDates, getPlatformMetricDatesThree, getPlatformMetricDatesTwo } from '@/app/actions'; // Import the updated method

const Dashboard = () => {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch metrics data using the combined method
        const data = await getPlatformMetricDatesTwo();

        // Separate the combined data into post metrics and platform metrics
        const postMetrics = data.filter((item: any) => item.date_retrieved && item.post_likes !== undefined); // Adjust filtering as needed
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
    };

    fetchData();
  }, []);

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
    </>
  );
};

export default Dashboard;
