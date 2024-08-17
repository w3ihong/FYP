import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Colors } from 'chart.js';


// Register the required components with Chart.js
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Colors, Title, Tooltip, Legend);

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


const SingleMetricLineChart = ({ metricName, metricData, dates }) => {
  const color = getRandomColor();
  const data = {
    labels: dates,
    datasets: [
      {
        label: metricName,
        data: metricData,
        borderColor: color,
        backgroundColor: color,
        fill: false,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `${metricName} Over Time`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          text: `${metricName}`,
        },
      },
    },
  };

  return (

  <div className='shadow rounded h-[23rem] p-4'>
    <Line data={data} options={options} />
  </div>  
  );
};

export default SingleMetricLineChart;