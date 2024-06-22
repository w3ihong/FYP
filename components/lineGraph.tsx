"use client";

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineGraphProps {
  data: ChartData<'line'>;
  title: string;
}

const LineGraph: React.FC<LineGraphProps> = ({ data, title }) => {
  const options: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      x: {
        type: 'category',
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="col-span-1 bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineGraph;
