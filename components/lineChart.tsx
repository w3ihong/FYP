import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Colors } from 'chart.js';

// Register the required components with Chart.js
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Colors, Title, Tooltip, Legend);

const SingleMetricLineChart = ({ metricName, metricData, dates, color }) => {
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