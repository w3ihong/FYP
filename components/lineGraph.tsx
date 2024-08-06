import React from 'react';
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

// Revised parseDate function to handle formatted date strings
const parseDate = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.error('Invalid date format:', dateString);
    return new Date();
  }
  return date;
};

const LineGraph: React.FC<LineGraphProps> = ({ data, metric, color, label, title }) => {
  const chartData = {
    labels: data.map((d: any) => parseDate(d.date_retrieved).toLocaleDateString()),
    datasets: [
      {
        label: label,
        data: data.map((d: any) => d[metric]),
        borderColor: color,
        borderWidth: 2,
        fill: false, // You can adjust this based on whether you want to fill under the line
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
