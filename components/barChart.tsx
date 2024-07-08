
'use client';

import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarGraphProps {
  data: any[];
  metrics: string[];
  colors: string[];
  label: string;
  title: string;
}

const formatLabel = (label: string) => {
  return label
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const BarGraph: React.FC<BarGraphProps> = ({ data, metrics, colors, label, title }) => {
  const chartData = {
    labels: data.map((d: any) => d.date_retrieved),
    datasets: metrics.map((metric, index) => ({
      label: formatLabel(metric),
      data: data.map((d: any) => d[metric]),
      backgroundColor: colors[index],
    })),
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow h-50">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default BarGraph;
