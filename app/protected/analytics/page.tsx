'use client';

import { useEffect, useState } from 'react';
import LineGraph from '@/components/lineGraph';
import BarGraph from '@/components/barChart';
import PieChart from '@/components/pieChart';
import TotalStatsCard from '@/components/totalStatsCard';
import { createClient } from '@/utils/supabase/client';

const Dashboard = () => {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [platformMetrics, setPlatformMetrics] = useState<any | null>(null); // State for platform metrics
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recent post metrics
        const { data: postMetrics, error: postError } = await supabase
          .from('post_metrics')
          .select('*')
          .order('date_retrieved', { ascending: false })
          .limit(10);

        if (postError) {
          console.error('Supabase error fetching post metrics:', postError);
          setError(postError.message);
          setLoading(false);
          return;
        }

        setMetrics(postMetrics);

        // Fetch total platform metrics
        const { data: platformMetricsData, error: platformError } = await supabase
          .from('platform_metrics')
          .select('*')
          .single();

        if (platformError) {
          console.error('Supabase error fetching platform metrics:', platformError);
          setError(platformError.message);
          setLoading(false);
          return;
        }

        setPlatformMetrics(platformMetricsData);
        setLoading(false);
      } catch (error) {
        console.error('Fetch error:', error);
        setError((error as Error).message);
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const { platform_account_views, platform_followers, platform_likes, platform_comments, platform_saves, platform_shares } = platformMetrics || {};

  return (
    <>
      <div className="col-span-3">
        <TotalStatsCard
          profileViews={platform_account_views || 0}
          followers={platform_followers || 0}
          likes={platform_likes || 0}
          shares={platform_shares || 0}
          comments={platform_comments || 0}
          saved={platform_saves || 0}
        />
      </div>

      <div className="col-span-1">
        <LineGraph 
          data={metrics} 
          metric="post_likes" 
          color="rgba(75, 192, 192, 1)" 
          label="Post Likes Over Time"
          title="Post Likes Over Time" 
        />
      </div>
      <div className="col-span-1">
        <LineGraph 
          data={metrics} 
          metric="post_shares" 
          color="rgba(153, 102, 255, 1)" 
          label="Post Shares Over Time"
          title="Post Shares Over Time" 
        />
      </div>
      <div className="col-span-1">
        <LineGraph 
          data={metrics} 
          metric="post_comments" 
          color="rgba(255, 159, 64, 1)" 
          label="Post Comments Over Time"
          title="Post Comments Over Time" 
        />
      </div>
      <div className="col-span-1">
        <LineGraph 
          data={metrics} 
          metric="post_impressions" 
          color="rgba(54, 162, 235, 1)" 
          label="Post Impressions Over Time"
          title="Post Impressions Over Time" 
        />
      </div>
      <div className="col-span-1">
        <BarGraph
          data={metrics}
          metrics={['post_likes', 'post_shares', 'post_comments']}
          colors={['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)']}
          label="Likes, Shares, and Comments"
          title="Likes, Shares, and Comments Comparison"
        />
      </div>
      <div className="col-span-1">
        <BarGraph
          data={metrics}
          metrics={['post_engagement_rate']}
          colors={['rgba(255, 206, 86, 0.6)']}
          label="Engagement Rate"
          title="Engagement Rate Comparison"
        />
      </div>
      <div className="col-span-1">
        <PieChart
          data={metrics}
          metrics={['post_likes', 'post_shares', 'post_comments']}
          colors={['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)']}
          title="Distribution of Different Interactions"
        />
      </div>
    </>
  );
};

export default Dashboard;
