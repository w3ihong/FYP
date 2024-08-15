'use client';

import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarGraphProps {
  data: any;
  label: string;
  title: string;
}

const defaultColors = [
  'rgba(255, 99, 132, 1)',  // Red
  'rgba(54, 162, 235, 1)',  // Blue
  'rgba(75, 192, 192, 1)',  // Green
  'rgba(255, 206, 86, 1)',  // Yellow
  'rgba(153, 102, 255, 1)', // Purple
  'rgba(255, 159, 64, 1)',  // Orange
];

const getRandomColor = () => {
  return defaultColors[Math.floor(Math.random() * defaultColors.length)];
};

const BarGraph: React.FC<BarGraphProps> = ({ data, label, title }) => {
  const color = getRandomColor();
  const chartData = {
    labels: Object.keys(data),  // Age groups as labels
    datasets: [
      {
        label: label,
        data: Object.values(data),  // Values for each age group
        backgroundColor: color,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,  // Horizontal bars
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Value',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Age Group',
        },
      },
    },
  };

  return (
    <div className=" w-72">
      <h2 className="text-xl">{title}</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarGraph;
