import React, { useState, useEffect } from 'react';

const DecisionMatrix = ({ data }) => {
  const [actions, setActions] = useState([]);
  const [executingId, setExecutingId] = useState(null);
  const [executed, setExecuted] = useState({});

  useEffect(() => {
    if (!data || !data.kpis) return;

    const { kpis } = data;
    const generatedActions = [];

    // Analyze Stockout Risk
    const stockoutParsed = parseInt(kpis.stockout_risk_days) || 15;
    if (stockoutParsed < 25) {
      generatedActions.push({
        id: 'restock',
        title: 'SUPPLY CHAIN: Expedite Freight Shipment',
        description: `Depletion threshold at ${stockoutParsed} days. Authorizing emergency air-freight routing to coastal warehouses to prevent Q4 blackout.`,
        system: 'ERP Logistics API',
        threatLevel: 'high',
        color: '#ff0055'
      });
    }

    // Analyze Momentum
    const momentum = kpis.momentum_delta || "";
    if (momentum.includes("+")) {
      generatedActions.push({
        id: 'price-hike',
        title: 'ALGORITHMIC PRICING: Increase MSRP +2.5%',
        description: `High positive velocity (${momentum}) detected. Executing micro-hike across Shopify endpoints to maximize margin before momentum cools.`,
        system: 'Pricing Engine API',
        threatLevel: 'medium',
        color: '#b026ff'
      });
    } else {
      generatedActions.push({
        id: 'ad-boost',
        title: 'MARKETING MATRIX: Inject $5k Ad Spend',
        description: `Negative/stalling momentum detected. Injecting immediate capital into Instagram/TikTok top-of-funnel campaigns.`,
        system: 'AdWords Nexus',
        threatLevel: 'medium',
        color: '#ffb800'
      });
    }

    // Analyze Competitor Index / Anomaly
    const anomaly = kpis.anomaly_probability || "0%";
    if (parseFloat(anomaly) > 10) {
      generatedActions.push({
        id: 'audit',
        title: 'SECURITY PERIMETER: Initiate Deep Audit',
        description: `Anomaly rate at ${anomaly}. Triggering automated compliance bots to crawl for competitor bot-net traffic interference.`,
        system: 'Cloudflare Shield',
        threatLevel: 'low',
        color: '#00f0ff'
      });
    }

    setActions(generatedActions);
  }, [data]);

  const handleExecute = (id) => {
    setExecutingId(id);
    
    // Simulate API call execution delay
    setTimeout(() => {
      setExecutingId(null);
      setExecuted(prev => ({...prev, [id]: true}));
    }, 2500);
  };

  if (actions.length === 0) return null;

  return (
    <div className="w-full mt-10 bg-[#0a0a0f]/90 backdrop-blur-xl border border-[#00f0ff]/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,240,255,0.05)] relative overflow-hidden">
      {/* Background static grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgwaC0xbS41LjVWMGMwIC41LjUuNS41LjV6IiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZT0iIzAyMzZkMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMTUiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] pointer-events-none opacity-50"></div>
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h2 className="text-xl font-extrabold text-[#00f0ff] font-mono tracking-[0.2em] flex items-center">
          <span className="w-3 h-3 bg-[#ff0055] rounded-sm mr-4 animate-pulse"></span>
          TACTICAL DECISION EXECUTOR
        </h2>
        <div className="font-mono text-xs text-gray-500 uppercase tracking-widest">{actions.length} Directives Pending</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 relative z-10">
        {actions.map(action => {
          const isDone = executed[action.id];
          const isWorking = executingId === action.id;

          return (
            <div key={action.id} className="flex flex-col justify-between p-5 rounded-xl border border-white/5 bg-[#121218]/80 hover:bg-[#1a1a24] transition-colors relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-1 h-full`} style={{backgroundColor: action.color}}></div>
              
              <div className="mb-4 pl-3">
                <span className="text-[9px] font-bold uppercase tracking-widest border border-white/10 px-2 py-1 rounded inline-block text-gray-400 mb-3" style={{color: action.color, borderColor: `${action.color}40`}}>
                  TARGET: {action.system}
                </span>
                <h3 className="text-sm font-bold text-white font-mono tracking-wide mb-2 leading-relaxed">{action.title}</h3>
                <p className="text-gray-400 text-xs font-mono leading-relaxed opacity-80">{action.description}</p>
              </div>

              <div className="pl-3">
                {isDone ? (
                  <button disabled className="w-full py-3 bg-[#0a2e1d] text-[#00ff88] border border-[#00ff88]/30 rounded font-mono text-xs font-bold tracking-widest uppercase flex items-center justify-center">
                    <span className="mr-2">✓</span> DIRECTIVE EXECUTED
                  </button>
                ) : isWorking ? (
                  <button disabled className="w-full py-3 bg-[#2a1a0f] text-[#ffb800] border border-[#ffb800]/30 rounded font-mono text-xs font-bold tracking-widest uppercase flex items-center justify-center overflow-hidden relative">
                    <div className="absolute inset-0 bg-[#ffb800]/10 animate-[pulse_1s_ease-in-out_infinite]"></div>
                    <span className="animate-spin mr-2">⚙</span> NEGOTIATING HANDSHAKE...
                  </button>
                ) : (
                  <button 
                    onClick={() => handleExecute(action.id)}
                    disabled={executingId !== null} 
                    className="w-full py-3 bg-black/50 text-white hover:text-white border border-white/10 hover:border-[#00f0ff] rounded font-mono text-xs font-bold tracking-widest uppercase transition-all shadow-[0_0_0_transparent] hover:shadow-[inset_0_0_15px_rgba(0,240,255,0.2)] hover:bg-[#00f0ff]/10 disabled:opacity-50 disabled:cursor-not-allowed group-hover:border-white/20 relative"
                  >
                    AUTHORIZE EXECUTION
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DecisionMatrix;
