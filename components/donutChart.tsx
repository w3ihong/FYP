"use client";

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

interface DonutChartProps {
  data: ChartData<'doughnut'>;
  title: string;
}

const DonutChart: React.FC<DonutChartProps> = ({ data, title }) => {
  return (
    <div className="col-span-1 bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <Doughnut data={data} />
    </div>
  );
};

export default DonutChart;
