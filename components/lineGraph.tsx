
'use client';

import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface LineGraphProps {
  data: any[];
  metric: string;
  color: string;
  label: string;
  title: string;
}

const LineGraph: React.FC<LineGraphProps> = ({ data, metric, color, label, title }) => {
  const chartData = {
    labels: data.map((d: any) => d.date_retrieved),
    datasets: [
      {
        label: label,
        data: data.map((d: any) => d[metric]),
        borderColor: color,
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow h-70">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <Line data={chartData} />
    </div>
  );
};

export default LineGraph;
