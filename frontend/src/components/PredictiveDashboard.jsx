import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ForecastChart from './ForecastChart';
import PredictiveKPIs from './PredictiveKPIs';
import ExecutiveSummary from './ExecutiveSummary';
import ScenarioWarRoom from './ScenarioWarRoom';
import WarCouncil from './WarCouncil';
import DecisionMatrix from './DecisionMatrix';
import LiveSentimentFeed from './LiveSentimentFeed';

const PredictiveDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [targetTerm, setTargetTerm] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    const term = localStorage.getItem('active_intercept_term') || '';
    setTargetTerm(term);

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:2000/api/forecast', { credentials: 'include' });
        if (res.ok) setData(await res.json());
      } catch {}
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleSimulate = async (priceShock, sentimentShock) => {
    setIsSimulating(true);
    try {
      const res = await fetch('http://localhost:2000/api/forecast', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price_shock: priceShock, sentiment_shock: sentimentShock })
      });
      if (res.ok) setData(await res.json());
    } catch {}
    finally { setIsSimulating(false); }
  };

  return (
    <section className="pt-24 pb-16">
      <div className="container">
        <div className="mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-surface-900 mb-2">
            Predictive <span className="bg-gradient-to-r from-brand-500 to-amber-500 bg-clip-text text-transparent">Sales Intelligence</span>
          </h1>
          <p className="text-surface-500">AI-powered forecasting based on sentiment, market trends, and historical data.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="text-surface-400 animate-pulse">Loading forecast data...</div>
          </div>
        ) : !targetTerm ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-surface-200 shadow-card">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h2 className="text-xl font-bold text-surface-900 mb-2">No Product Selected</h2>
            <p className="text-surface-500 max-w-sm mx-auto mb-6 text-sm">Search for a product first to see forecasts and analytics.</p>
            <Link to="/intercept" className="inline-flex px-6 py-2.5 bg-surface-900 text-white text-sm font-semibold rounded-xl hover:bg-surface-800 transition-colors">
              Search a Product
            </Link>
          </div>
        ) : (
          <div>
            <PredictiveKPIs data={data} />

            <div className="mt-6 relative">
              {isSimulating && (
                <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                  <div className="text-surface-500 animate-pulse text-sm">Recalculating forecast...</div>
                </div>
              )}
              <ForecastChart data={data} />
            </div>

            <ExecutiveSummary data={data} />
            <ScenarioWarRoom onSimulate={handleSimulate} isSimulating={isSimulating} />
            <WarCouncil data={data} />
            <DecisionMatrix data={data} />
            <LiveSentimentFeed data={data} />
          </div>
        )}
      </div>
    </section>
  );
};

export default PredictiveDashboard;
