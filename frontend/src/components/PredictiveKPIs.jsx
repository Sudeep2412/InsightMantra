import React from 'react';

const PredictiveKPIs = ({ data }) => {
  if (!data || !data.kpis) return null;

  const kpis = [
    {
      title: "Projected 30-Day Demand",
      value: data.kpis.projected_30_day_demand.toLocaleString(),
      subtitle: "Units expected to sell",
      color: "text-blue-400"
    },
    {
      title: "Sentiment Correlation",
      value: data.kpis.sentiment_correlation,
      subtitle: "Impact of 1pt review change",
      color: "text-green-400"
    },
    {
      title: "Competitor Price Index",
      value: data.kpis.competitor_price_index,
      subtitle: "vs Average Market Baseline",
      color: "text-purple-400"
    },
    {
      title: "Stockout Risk",
      value: `${data.kpis.stockout_risk_days} Days`,
      subtitle: "Remaining inventory buffer",
      color: "text-red-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-10 px-4 xl:px-0">
      {kpis.map((kpi, index) => (
        <div key={index} className="bg-[#0e0c15] border border-n-6 rounded-2xl p-6 shadow-lg hover:border-color-1 transition-colors relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-color-1/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h3 className="text-n-3 text-sm font-medium mb-2 uppercase tracking-wider">{kpi.title}</h3>
          <div className={`text-3xl font-bold mb-1 ${kpi.color}`}>{kpi.value}</div>
          <p className="text-n-4 text-sm">{kpi.subtitle}</p>
        </div>
      ))}
    </div>
  );
};

export default PredictiveKPIs;
