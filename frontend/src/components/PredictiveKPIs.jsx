import React from 'react';

const PredictiveKPIs = ({ data }) => {
  if (!data || !data.kpis) return null;

  const kpis = [
    { title: "30-Day Demand", value: data.kpis.projected_30_day_demand.toLocaleString(), subtitle: "Projected units", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
    { title: "Sentiment", value: data.kpis.sentiment_correlation, subtitle: "Review impact", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
    { title: "Price Index", value: data.kpis.competitor_price_index, subtitle: "vs. Market avg", color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
    { title: "Stockout Risk", value: `${data.kpis.stockout_risk_days}d`, subtitle: "Time to depletion", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    { title: "Anomaly Risk", value: data.kpis.anomaly_probability, subtitle: "Outlier probability", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
    { title: "Accuracy", value: data.kpis.confidence_score, subtitle: "Model confidence", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { title: "Momentum", value: data.kpis.momentum_delta, subtitle: "Sales velocity", color: "text-sky-600", bg: "bg-sky-50", border: "border-sky-100" },
    { title: "Saturation", value: data.kpis.saturation_level, subtitle: "Market capacity", color: "text-pink-600", bg: "bg-pink-50", border: "border-pink-100" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {kpis.map((kpi, index) => (
        <div key={index} className={`${kpi.bg} ${kpi.border} border rounded-2xl p-5 transition-all hover:shadow-card-hover`}>
          <p className="text-xs font-medium text-surface-500 mb-1">{kpi.title}</p>
          <p className={`text-2xl lg:text-3xl font-bold ${kpi.color} tracking-tight`}>{kpi.value}</p>
          <p className="text-xs text-surface-400 mt-1">{kpi.subtitle}</p>
        </div>
      ))}
    </div>
  );
};

export default PredictiveKPIs;
