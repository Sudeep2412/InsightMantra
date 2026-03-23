import React, { useEffect, useState, useRef } from 'react';
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
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (data && data.forecast) {
      const { dates, predictions, neural_predictions, ensemble_predictions, confidence_lower, confidence_upper } = data.forecast;

      setChartData({
        labels: dates,
        datasets: [
          {
            fill: true,
            label: 'Upper Volatility Bound',
            data: confidence_upper,
            borderColor: 'transparent',
            backgroundColor: 'rgba(0, 240, 255, 0.05)',
            pointRadius: 0,
            tension: 0.5
          },
          {
            fill: '-1',
            label: 'Lower Volatility Bound',
            data: confidence_lower,
            borderColor: 'transparent',
            backgroundColor: 'rgba(0, 240, 255, 0.05)',
            pointRadius: 0,
            tension: 0.5
          },
          {
            label: 'Prophet Algorithmic Baseline',
            data: predictions,
            borderColor: 'rgba(255, 255, 255, 0.15)',
            borderDash: [4, 4],
            backgroundColor: 'transparent',
            pointRadius: 0,
            tension: 0.5,
            fill: false,
            borderWidth: 2
          },
          {
            label: 'RandomForest Ensemble Override',
            data: ensemble_predictions || predictions,
            borderColor: '#ff0055',
            backgroundColor: 'transparent',
            pointBorderColor: '#ff0055',
            pointBackgroundColor: '#0e0c15',
            pointRadius: 3,
            pointHoverRadius: 7,
            tension: 0.5,
            fill: false,
            borderWidth: 2
          },
          {
            label: 'Dense Neural (LSTM/MLP) Optimized',
            data: neural_predictions || predictions,
            borderColor: '#00f0ff',
            backgroundColor: 'transparent',
            pointBackgroundColor: '#0e0c15',
            pointBorderColor: '#00f0ff',
            pointRadius: 4,
            pointHoverRadius: 8,
            tension: 0.5,
            fill: false,
            borderWidth: 4,
          }
        ],
      });
    }
  }, [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e2e8f0',
          font: { family: 'monospace', size: 11 },
          usePointStyle: true,
          boxWidth: 8,
        }
      },
      title: {
        display: true,
        text: '30-DAY PREDICTIVE SALES HUD',
        color: '#00f0ff',
        font: { size: 18, family: 'monospace', weight: 'bold' },
        padding: { top: 10, bottom: 20 },
        align: 'start'
      },
      tooltip: {
        backgroundColor: 'rgba(14, 12, 21, 0.95)',
        titleColor: '#00f0ff',
        bodyColor: '#e2e8f0',
        borderColor: '#00f0ff',
        borderWidth: 1,
        padding: 14,
        titleFont: { size: 14, family: 'monospace', weight: 'bold' },
        bodyFont: { size: 13, family: 'monospace' },
        displayColors: true,
        boxPadding: 6,
        cornerRadius: 4,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(0, 240, 255, 0.05)', drawBorder: false, tickLength: 8 },
        ticks: { color: 'rgba(255, 255, 255, 0.5)', font: { family: 'monospace', size: 10 }, maxRotation: 45, minRotation: 45 }
      },
      y: {
        grid: { color: 'rgba(255, 0, 85, 0.1)', borderDash: [4, 4], drawBorder: false },
        ticks: { color: '#ff0055', font: { family: 'monospace', size: 11 } }
      }
    }
  };

  if (!chartData) return <div className="text-[#00f0ff] font-mono text-center p-12 tracking-widest animate-pulse border border-[#00f0ff]/30 bg-[#00f0ff]/5 rounded-xl">INITIALIZING NEURAL CHART MATRIX...</div>;

  return (
    <div className="w-full relative group">
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#00f0ff]/20 to-[#ff0055]/20 rounded-[1.5rem] blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative w-full h-[450px] p-6 bg-[#0a0a0f] rounded-2xl border border-[#00f0ff]/30 shadow-[0_0_50px_rgba(0,240,255,0.1)]">
        <Line ref={chartRef} options={options} data={chartData} />
      </div>
      
      {/* Corner UI Elements */}
      <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-[#00f0ff] opacity-50"></div>
      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-[#ff0055] opacity-50"></div>
    </div>
  );
};

export default ForecastChart;
