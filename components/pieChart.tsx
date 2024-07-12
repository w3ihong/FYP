
'use client';

import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: any[];
  metrics: string[];
  colors: string[];
  title: string;
}

const formatLabel = (label: string) => {
  return label
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const PieChart: React.FC<PieChartProps> = ({ data, metrics, colors, title }) => {
  const chartData = {
    labels: metrics.map(metric => formatLabel(metric)),
    datasets: [
      {
        data: metrics.map(metric =>
          data.reduce((acc: number, curr: any) => acc + curr[metric], 0)
        ),
        backgroundColor: colors,
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        titleColor: 'black',
        bodyColor: 'black',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow h-50">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PieChart;
