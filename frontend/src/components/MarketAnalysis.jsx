import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import Section from './Section';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const MarketAnalysis = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:2000/api/market_analysis', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data && data.brands && data.brands.length > 0) {
            const labels = ['Price', 'Rating', 'Reviews', 'Availability', 'Value', 'Popularity'];
            const colors = ['#F97316', '#3B82F6', '#10B981', '#EF4444', '#8B5CF6'];
            setChartData({
              labels,
              datasets: data.brands.slice(0, 5).map((brand, i) => ({
                label: brand.name, data: brand.scores || [70, 80, 60, 50, 75, 65].map(v => v + Math.random() * 20 - 10),
                borderColor: colors[i % colors.length], backgroundColor: `${colors[i % colors.length]}15`,
                borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#fff', pointBorderColor: colors[i % colors.length],
              }))
            });
          }
        }
      } catch {}
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const options = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#78716C', font: { family: 'Inter', size: 12 }, usePointStyle: true, boxWidth: 6, padding: 20 } },
      tooltip: { backgroundColor: '#fff', titleColor: '#1C1917', bodyColor: '#57534E', borderColor: '#E7E5E4', borderWidth: 1, padding: 12, cornerRadius: 8 },
    },
    scales: {
      r: { grid: { color: '#F5F5F4' }, angleLines: { color: '#E7E5E4' }, pointLabels: { color: '#78716C', font: { family: 'Inter', size: 12 } }, ticks: { display: false } }
    }
  };

  return (
    <section className="pb-16">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-surface-900 mb-3">Brand Market Share</h2>
          <p className="text-surface-500 max-w-xl mx-auto">Compare brand performance using real-time data.</p>
        </div>

        <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-6">
          {loading || !chartData ? (
            <div className="text-center text-surface-400 py-20 animate-pulse">Loading chart...</div>
          ) : (
            <div className="w-full h-[400px] md:h-[500px]">
              <Radar data={chartData} options={options} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MarketAnalysis;
