"use client";

import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

interface PieChartProps {
  data: ChartData<'pie'>;
  title: string;
}

const PieChart: React.FC<PieChartProps> = ({ data, title }) => {
  return (
    <div className="col-span-1 bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <Pie data={data} />
    </div>
  );
};

export default PieChart;
