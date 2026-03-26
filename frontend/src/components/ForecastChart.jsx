import React, { useEffect, useState, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const ForecastChart = ({ data }) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (data && data.forecast) {
      const { dates, predictions, neural_predictions, ensemble_predictions, confidence_lower, confidence_upper } = data.forecast;
      setChartData({
        labels: dates,
        datasets: [
          { fill: true, label: 'Upper Bound', data: confidence_upper, borderColor: 'transparent', backgroundColor: 'rgba(249, 115, 22, 0.06)', pointRadius: 0, tension: 0.4 },
          { fill: '-1', label: 'Lower Bound', data: confidence_lower, borderColor: 'transparent', backgroundColor: 'rgba(249, 115, 22, 0.06)', pointRadius: 0, tension: 0.4 },
          { label: 'Baseline', data: predictions, borderColor: '#D6D3D1', borderDash: [4, 4], backgroundColor: 'transparent', pointRadius: 0, tension: 0.4, fill: false, borderWidth: 1.5 },
          { label: 'Ensemble', data: ensemble_predictions || predictions, borderColor: '#FB923C', backgroundColor: 'transparent', pointBorderColor: '#FB923C', pointBackgroundColor: '#fff', pointRadius: 2, pointHoverRadius: 5, tension: 0.4, fill: false, borderWidth: 2 },
          { label: 'Primary', data: neural_predictions || predictions, borderColor: '#1C1917', backgroundColor: 'transparent', pointBackgroundColor: '#fff', pointBorderColor: '#1C1917', pointRadius: 3, pointHoverRadius: 6, tension: 0.4, fill: false, borderWidth: 2.5 },
        ],
      });
    }
  }, [data]);

  const options = {
    responsive: true, maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'top', labels: { color: '#78716C', font: { family: 'Inter', size: 12 }, usePointStyle: true, boxWidth: 6, padding: 20 } },
      title: { display: true, text: '30-Day Sales Forecast', color: '#1C1917', font: { size: 16, family: 'Inter', weight: '600' }, padding: { top: 10, bottom: 20 }, align: 'start' },
      tooltip: { backgroundColor: '#fff', titleColor: '#1C1917', bodyColor: '#57534E', borderColor: '#E7E5E4', borderWidth: 1, padding: 12, titleFont: { size: 13, family: 'Inter', weight: '600' }, bodyFont: { size: 12, family: 'Inter' }, cornerRadius: 8, boxPadding: 4 },
    },
    scales: {
      x: { grid: { color: '#F5F5F4', drawBorder: false }, ticks: { color: '#A8A29E', font: { family: 'Inter', size: 11 }, maxRotation: 45, minRotation: 45 } },
      y: { grid: { color: '#F5F5F4', drawBorder: false }, ticks: { color: '#A8A29E', font: { family: 'Inter', size: 11 } } }
    }
  };

  if (!chartData) return <div className="text-surface-400 text-center py-16 animate-pulse">Loading chart...</div>;

  return (
    <div className="w-full bg-white rounded-2xl border border-surface-200 shadow-card p-6">
      <div className="h-[400px]">
        <Line ref={chartRef} options={options} data={chartData} />
      </div>
    </div>
  );
};

export default ForecastChart;
