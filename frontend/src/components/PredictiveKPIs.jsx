import React from 'react';

const PredictiveKPIs = ({ data }) => {
  if (!data || !data.kpis) return null;

  const kpis = [
    {
      title: "PROJ 30D DEMAND",
      value: data.kpis.projected_30_day_demand.toLocaleString(),
      subtitle: "Units expected trajectory",
      color: "text-[#00f0ff]",
      borderColor: "border-[#00f0ff]"
    },
    {
      title: "SENTIMENT VECTOR",
      value: data.kpis.sentiment_correlation,
      subtitle: "Impact multiplier",
      color: "text-[#ff0055]",
      borderColor: "border-[#ff0055]"
    },
    {
      title: "COMPETITOR IDX",
      value: data.kpis.competitor_price_index,
      subtitle: "vs Market Baseline",
      color: "text-[#b026ff]",
      borderColor: "border-[#b026ff]"
    },
    {
      title: "STOCKOUT RISK",
      value: `${data.kpis.stockout_risk_days} Days`,
      subtitle: "Depletion threshold",
      color: "text-[#ffb800]",
      borderColor: "border-[#ffb800]"
    },
    {
      title: "ANOMALY PROBABILITY",
      value: data.kpis.anomaly_probability,
      subtitle: "Fraud / outlier risk",
      color: "text-[#fdba74]",
      borderColor: "border-[#fdba74]"
    },
    {
      title: "NEURAL ACCURACY",
      value: data.kpis.confidence_score,
      subtitle: "LSTM / Prophet Cross-Val",
      color: "text-[#86efac]",
      borderColor: "border-[#86efac]"
    },
    {
      title: "MOMENTUM DELTA",
      value: data.kpis.momentum_delta,
      subtitle: "Velocity shift",
      color: "text-[#93c5fd]",
      borderColor: "border-[#93c5fd]"
    },
    {
      title: "MARKET SATURATION",
      value: data.kpis.saturation_level,
      subtitle: "Target demographic cap",
      color: "text-[#f472b6]",
      borderColor: "border-[#f472b6]"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-10">
      {kpis.map((kpi, index) => (
        <div key={index} className={`relative bg-[#0a0a0f]/80 backdrop-blur-xl border-l-[3px] border-y-0 border-r-0 ${kpi.borderColor} px-6 rounded-r-2xl py-8 shadow-2xl hover:shadow-[0_0_40px_rgba(0,0,0,0.8)] transition-all duration-500 overflow-hidden group`}>
          {/* Subtle animated scanline */}
          <div className="absolute inset-0 w-full h-full bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>
          
          {/* Hover background pulse */}
          <div className={`absolute inset-0 w-full h-full opacity-0 group-hover:opacity-10 bg-gradient-to-r ${kpi.borderColor.replace('border', 'from')} to-transparent transition-opacity duration-500 pointer-events-none`}></div>
          
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h3 className="text-gray-400 font-mono text-xs font-bold tracking-[0.2em]">{kpi.title}</h3>
            <span className={`w-2 h-2 rounded-full animate-pulse ${kpi.borderColor.replace('border-', 'bg-')}`}></span>
          </div>
          
          <div className={`text-4xl lg:text-5xl font-mono font-black mb-2 tracking-tighter ${kpi.color} relative z-10 drop-shadow-[0_0_15px_currentColor]`}>
            {kpi.value}
          </div>
          
          <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest relative z-10">{kpi.subtitle}</p>
          
          {/* Abstract corner decoration */}
          <div className="absolute bottom-0 right-0 w-16 h-16 opacity-30 pointer-events-none">
            <div className={`absolute bottom-2 right-2 w-4 h-[1px] ${kpi.borderColor.replace('border-', 'bg-')}`}></div>
            <div className={`absolute bottom-2 right-2 w-[1px] h-4 ${kpi.borderColor.replace('border-', 'bg-')}`}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PredictiveKPIs;
