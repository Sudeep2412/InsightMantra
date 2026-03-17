import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ForecastChart = ({ data }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (data && data.forecast) {
      const { dates, predictions, confidence_lower, confidence_upper } = data.forecast;
      
      setChartData({
        labels: dates,
        datasets: [
          {
            fill: true,
            label: 'Upper Confidence Limit',
            data: confidence_upper,
            borderColor: 'transparent',
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            pointRadius: 0,
            tension: 0.4
          },
          {
            fill: '-1',
            label: 'Lower Confidence Limit',
            data: confidence_lower,
            borderColor: 'transparent',
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            pointRadius: 0,
            tension: 0.4
          },
          {
            label: 'Predicted Sales',
            data: predictions,
            borderColor: 'rgba(56, 189, 248, 1)',
            borderDash: [5, 5],
            backgroundColor: 'rgba(56, 189, 248, 1)',
            pointRadius: 3,
            tension: 0.4,
            fill: false
          }
        ],
      });
    }
  }, [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff'
        }
      },
      title: {
        display: true,
        text: '30-Day Predictive Sales Forecast',
        color: '#fff',
        font: {
          size: 16
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#fff'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#fff'
        }
      }
    }
  };

  if (!chartData) return <div className="text-white text-center p-8">Loading forecast data...</div>;

  return (
    <div className="w-full h-[400px] p-4 bg-[#0e0c15] rounded-xl border border-n-6 shadow-2xl">
      <Line options={options} data={chartData} />
    </div>
  );
};

export default ForecastChart;
