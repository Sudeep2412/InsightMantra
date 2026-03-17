import React, { useState, useEffect } from 'react';
import ForecastChart from './ForecastChart';
import PredictiveKPIs from './PredictiveKPIs';

const PredictiveDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real scenario, this would point to the Flask endpoint
    // e.g. /api/forecast
    
    // We'll mock the fetch here since Flask might not be running simultaneously
    const fetchForecast = async () => {
      try {
        const response = await fetch('http://localhost:2000/api/forecast');
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          // Mock data if API is down
          console.warn("API not accessible, falling back to mock data");
          mockDataFallback();
        }
      } catch (error) {
        console.warn("API fetch failed, falling back to mock data");
        mockDataFallback();
      } finally {
        setLoading(false);
      }
    };

    const mockDataFallback = () => {
      const dates = Array.from({length: 30}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i + 1);
        return d.toISOString().split('T')[0];
      });
      const base = 50;
      const preds = dates.map((_, i) => base + Math.sin(i / 3) * 10 + Math.random() * 5);
      
      setData({
        forecast: {
          dates: dates,
          predictions: preds.map(p => Math.round(p)),
          confidence_lower: preds.map(p => Math.round(p * 0.8)),
          confidence_upper: preds.map(p => Math.round(p * 1.2))
        },
        kpis: {
          projected_30_day_demand: Math.round(preds.reduce((a, b) => a + b, 0)),
          sentiment_correlation: "+12.4%",
          competitor_price_index: "98.5",
          stockout_risk_days: 18
        }
      });
    };

    fetchForecast();
  }, []);

  return (
    <section className="container mx-auto px-4 py-8 mb-20" id="forecasting">
      <div className="text-center mb-10">
        <h2 className="text-3xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">Predictive Sales Intelligence</h2>
        <p className="text-n-3 mt-4 text-lg">AI-powered forecasting based on sentiment, market price, and historical data</p>
      </div>
      
      {loading ? (
        <div className="text-center text-white p-20 text-xl animate-pulse">Analyzing market signals...</div>
      ) : (
        <>
          <PredictiveKPIs data={data} />
          <ForecastChart data={data} />
        </>
      )}
    </section>
  );
};

export default PredictiveDashboard;
