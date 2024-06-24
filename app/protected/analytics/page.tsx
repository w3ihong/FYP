"use client";

import React, { useState, useEffect } from 'react';
import LineGraph from '@/components/lineGraph';
import PieChart from '@/components/pieChart';
import BarChart from '@/components/barChart';
import DonutChart from '@/components/donutChart';

// Sample data for charts
const sampleLineData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Follower Growth Over Time',
      data: [200, 250, 300, 350, 400, 450, 500],
      fill: false,
      backgroundColor: 'rgba(75, 192, 192, 0.4)',
      borderColor: 'rgba(75, 192, 192, 1)',
    },
    {
      label: 'Engagement Rate Over Time',
      data: [3.5, 3.7, 4.0, 4.2, 4.5, 4.7, 5.0],
      fill: false,
      backgroundColor: 'rgba(153, 102, 255, 0.4)',
      borderColor: 'rgba(153, 102, 255, 1)',
    },
    {
      label: 'Post Frequency Over Time',
      data: [5, 6, 7, 8, 9, 10, 11],
      fill: false,
      backgroundColor: 'rgba(255, 159, 64, 0.4)',
      borderColor: 'rgba(255, 159, 64, 1)',
    },
    {
      label: 'Click-Through Rate (CTR) Over Time',
      data: [2.0, 2.2, 2.5, 2.7, 3.0, 3.2, 3.5],
      fill: false,
      backgroundColor: 'rgba(54, 162, 235, 0.4)',
      borderColor: 'rgba(54, 162, 235, 1)',
    },
    {
      label: 'Conversion Rate Over Time',
      data: [1.0, 1.2, 1.5, 1.7, 2.0, 2.2, 2.5],
      fill: false,
      backgroundColor: 'rgba(255, 206, 86, 0.4)',
      borderColor: 'rgba(255, 206, 86, 1)',
    },
    {
      label: 'Video Views Over Time',
      data: [1000, 1200, 1400, 1600, 1800, 2000, 2200],
      fill: false,
      backgroundColor: 'rgba(75, 192, 192, 0.4)',
      borderColor: 'rgba(75, 192, 192, 1)',
    },
  ],
};

const sampleBarData = {
  labels: ['Post 1', 'Post 2', 'Post 3', 'Post 4', 'Post 5', 'Post 6', 'Post 7'],
  datasets: [
    {
      label: 'Top Performing Posts',
      data: [120, 150, 180, 200, 220, 250, 300],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
    {
      label: 'Engagement by Post Type',
      data: [30, 45, 60, 50, 70, 90, 110],
      backgroundColor: 'rgba(153, 102, 255, 0.2)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1,
    },
    {
      label: 'Reach by Social Media Platform',
      data: [500, 600, 700, 800, 900, 1000, 1100],
      backgroundColor: 'rgba(255, 159, 64, 0.2)',
      borderColor: 'rgba(255, 159, 64, 1)',
      borderWidth: 1,
    },
  ],
};

const samplePieData = {
  labels: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
  datasets: [
    {
      label: 'Audience Demographics',
      data: [25, 35, 20, 10, 5, 5],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const sampleDonutData = {
  labels: ['Negative', 'Neutral', 'Positive'],
  datasets: [
    {
      label: 'Sentiment Analysis',
      data: [12, 15, 73],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const DashboardPage = () => {
  const [lineGraphData, setLineGraphData] = useState(sampleLineData);
  const [pieChartData, setPieChartData] = useState(samplePieData);
  const [barChartData, setBarChartData] = useState(sampleBarData);
  const [donutChartData, setDonutChartData] = useState(sampleDonutData);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const { data: lineData, error: lineError } = await supabase.from('line_data').select('*');
  //     const { data: pieData, error: pieError } = await supabase.from('pie_data').select('*');
  //
  //     if (!lineError) setLineGraphData(lineData);
  //     if (!pieError) setPieChartData(pieData);
  //   };
  //   fetchData();
  // }, []);

  return (
    <>
      <LineGraph data={{ labels: lineGraphData.labels, datasets: [lineGraphData.datasets[0]] }} title="Follower Growth Over Time" />
      <LineGraph data={{ labels: lineGraphData.labels, datasets: [lineGraphData.datasets[1]] }} title="Engagement Rate Over Time" />
      <LineGraph data={{ labels: lineGraphData.labels, datasets: [lineGraphData.datasets[2]] }} title="Post Frequency Over Time" />
      <BarChart data={{ labels: barChartData.labels, datasets: [barChartData.datasets[0]] }} title="Top Performing Posts" />
      <BarChart data={{ labels: barChartData.labels, datasets: [barChartData.datasets[1]] }} title="Engagement by Post Type" />
      <BarChart data={{ labels: barChartData.labels, datasets: [barChartData.datasets[2]] }} title="Reach by Social Media Platform" />
      <PieChart data={pieChartData} title="Audience Demographics" />
      <PieChart data={pieChartData} title="Engagement by Platform" />
      <DonutChart data={donutChartData} title="Sentiment Analysis" />
      <LineGraph data={{ labels: lineGraphData.labels, datasets: [lineGraphData.datasets[3]] }} title="Click-Through Rate (CTR) Over Time" />
      <LineGraph data={{ labels: lineGraphData.labels, datasets: [lineGraphData.datasets[4]] }} title="Conversion Rate Over Time" />
      <LineGraph data={{ labels: lineGraphData.labels, datasets: [lineGraphData.datasets[5]] }} title="Video Views Over Time" />
    </>
  );
};

export default DashboardPage;
