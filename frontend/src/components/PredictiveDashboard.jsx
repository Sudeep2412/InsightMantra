import React, { useState, useEffect } from 'react';
import ForecastChart from './ForecastChart';
import PredictiveKPIs from './PredictiveKPIs';
import ExecutiveSummary from './ExecutiveSummary';
import ScenarioWarRoom from './ScenarioWarRoom';
import Section from './Section';
import StockTicker from './StockTicker';
import DecisionMatrix from './DecisionMatrix';
import LiveSentimentFeed from './LiveSentimentFeed';
import WarCouncil from './WarCouncil';
import { Link } from 'react-router-dom';

const PredictiveDashboard = () => {
  const targetTerm = localStorage.getItem('active_intercept_term');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);

  const fetchForecast = async (priceShock = 1.0, sentimentShock = 1.0) => {
    if (!targetTerm) {
      setLoading(false);
      return;
    }
    setIsSimulating(true);
    try {
      const response = await fetch('http://localhost:2000/api/forecast', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price_shock: priceShock, sentiment_shock: sentimentShock })
      });
      
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        console.warn("API not accessible, falling back to mock data");
        mockDataFallback(priceShock, sentimentShock);
      }
    } catch (error) {
      console.warn("API fetch failed, falling back to mock data");
      mockDataFallback(priceShock, sentimentShock);
    } finally {
      setLoading(false);
      setIsSimulating(false);
    }
  };

  const mockDataFallback = (priceShock, sentimentShock) => {
    const dates = Array.from({length: 30}, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i + 1);
      return d.toISOString().split('T')[0];
    });
    const base = 50 * priceShock * sentimentShock;
    const preds = dates.map((_, i) => base + Math.sin(i / 3) * 10 + Math.random() * 5);
    
    setData({
      forecast: {
        dates: dates,
        predictions: preds.map(p => Math.round(p)),
        neural_predictions: preds.map(p => Math.round(p * 1.05)),
        ensemble_predictions: preds.map(p => Math.round(p * 0.98)),
        confidence_lower: preds.map(p => Math.round(p * 0.8)),
        confidence_upper: preds.map(p => Math.round(p * 1.2))
      },
      kpis: {
        projected_30_day_demand: Math.round(preds.reduce((a, b) => a + b, 0)),
        sentiment_correlation: "+12.4%",
        competitor_price_index: "98.5",
        stockout_risk_days: 18,
        anomaly_probability: "14.2% Risk",
        confidence_score: "94.8% Opt",
        momentum_delta: "+3.4 Vol/Hr",
        saturation_level: "High/Cap"
      }
    });
  };

  useEffect(() => {
    fetchForecast(1.0, 1.0);
  }, []);

  const handleSimulate = (priceShock, sentimentShock) => {
    fetchForecast(priceShock, sentimentShock);
  };

  return (
    <Section className="py-20" id="forecasting">
      <StockTicker />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mt-10 mb-16 relative z-2">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Predictive <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">Sales Intelligence</span>
          </h2>
          <p className="max-w-2xl mx-auto text-n-3 lg:text-xl">
            AI-powered forecasting based on live sentiment, market trajectories, and algorithmic volume profiling.
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="text-center text-color-1 font-mono tracking-widest animate-pulse border border-color-1/30 px-10 py-6 rounded-full bg-color-1/10 shadow-[0_0_40px_rgba(168,85,247,0.3)]">
              ANALYZING QUANTUM SIGNALS...
            </div>
          </div>
        ) : !targetTerm ? (
          <div className="flex flex-col items-center justify-center py-32 bg-[#0a0a0f]/40 backdrop-blur-md rounded-[2.5rem] border border-[#ff0055]/30 shadow-[0_0_50px_rgba(255,0,85,0.1)] text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGgyMHYyMEgwaC0xbS41LjVWMGMwIC41LjUuNS41LjV6IiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZT0iIzAyMzZkMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] pointer-events-none opacity-20"></div>
            <div className="w-16 h-16 rounded-full border border-[#ff0055] flex items-center justify-center animate-pulse mb-6 relative z-10 bg-[#ff0055]/10">
              <span className="text-[#ff0055] text-2xl font-mono font-bold">!</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-mono font-bold text-[#ff0055] tracking-widest mb-4 relative z-10">AWAITING NEURAL TARGET</h2>
            <p className="text-gray-400 font-mono tracking-widest max-w-md max-auto mb-10 text-xs md:text-sm leading-relaxed relative z-10">
              No active mission telemetry. The dashboard currently lacks an established trajectory vector to calculate tactical outputs.
            </p>
            <Link to="/intercept" className="px-8 py-4 bg-transparent border border-[#00f0ff] text-[#00f0ff] rounded font-mono text-sm font-bold hover:bg-[#00f0ff]/10 hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition uppercase tracking-widest relative z-10">
              COMMENCE INTERCEPT
            </Link>
          </div>
        ) : (
          <div className="bg-[#0a0a0f]/40 backdrop-blur-md rounded-[2.5rem] border border-[#00f0ff]/10 overflow-hidden p-6 md:p-12 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
            <PredictiveKPIs data={data} />
            <ExecutiveSummary data={data} />
            <LiveSentimentFeed data={data} />
            <DecisionMatrix data={data} />
            <ScenarioWarRoom onSimulate={handleSimulate} isSimulating={isSimulating} />
            <WarCouncil data={data} />
            <div className="mt-8 bg-n-7/50 border border-n-6 p-4 rounded-3xl shadow-inner relative">
              {isSimulating && (
                <div className="absolute inset-0 z-10 bg-n-8/50 backdrop-blur-sm flex items-center justify-center rounded-3xl rounded-b-none">
                  <div className="text-cyan-400 font-mono tracking-widest text-sm animate-pulse">RECALCULATING MULTI-LAYER PERCEPTRON...</div>
                </div>
              )}
              <ForecastChart data={data} />
            </div>
          </div>
        )}
      </div>
      
      {/* Background glowing gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none blur-[100px] -z-1" />
    </Section>
  );
};

export default PredictiveDashboard;
