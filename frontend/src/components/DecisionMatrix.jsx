import React, { useState, useEffect } from 'react';

const DecisionMatrix = ({ data }) => {
  const [actions, setActions] = useState([]);
  const [executingId, setExecutingId] = useState(null);
  const [executed, setExecuted] = useState({});

  useEffect(() => {
    if (!data || !data.kpis) return;
    const { kpis } = data;
    const generated = [];
    const stockout = parseInt(kpis.stockout_risk_days) || 15;
    if (stockout < 25) generated.push({ id: 'restock', title: 'Expedite Shipment', description: `Stock runs out in ${stockout} days. Order more inventory.`, system: 'Inventory', color: '#EF4444' });
    const momentum = kpis.momentum_delta || "";
    if (momentum.includes("+")) generated.push({ id: 'price', title: 'Increase Price +2.5%', description: `Positive momentum (${momentum}). Small price increase to maximize margin.`, system: 'Pricing', color: '#8B5CF6' });
    else generated.push({ id: 'ads', title: 'Boost Ad Spend', description: `Weak momentum. Increase ads to drive traffic.`, system: 'Marketing', color: '#F59E0B' });
    const anomaly = kpis.anomaly_probability || "0%";
    if (parseFloat(anomaly) > 10) generated.push({ id: 'audit', title: 'Check Anomalies', description: `Anomaly rate ${anomaly}. Review data for unusual patterns.`, system: 'Analytics', color: '#3B82F6' });
    setActions(generated);
  }, [data]);

  const handleExecute = (id) => { setExecutingId(id); setTimeout(() => { setExecutingId(null); setExecuted(prev => ({ ...prev, [id]: true })); }, 2000); };

  if (actions.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-6 mt-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-surface-900 flex items-center gap-2">
          <span className="w-2 h-2 bg-brand-500 rounded-full"></span> Recommended Actions
        </h3>
        <span className="text-xs text-surface-400">{actions.length} pending</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {actions.map(action => {
          const isDone = executed[action.id];
          const isWorking = executingId === action.id;
          return (
            <div key={action.id} className="border border-surface-100 rounded-xl p-5 hover:border-surface-200 transition-colors">
              <span className="text-xs font-medium px-2 py-1 rounded-full mb-3 inline-block" style={{ backgroundColor: `${action.color}10`, color: action.color }}>{action.system}</span>
              <h4 className="text-sm font-semibold text-surface-900 mb-1">{action.title}</h4>
              <p className="text-xs text-surface-500 mb-4 leading-relaxed">{action.description}</p>
              {isDone ? (
                <button disabled className="w-full py-2 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-lg border border-emerald-100">✓ Done</button>
              ) : isWorking ? (
                <button disabled className="w-full py-2 bg-amber-50 text-amber-600 text-xs font-semibold rounded-lg border border-amber-100 animate-pulse">Processing...</button>
              ) : (
                <button onClick={() => handleExecute(action.id)} disabled={executingId !== null}
                  className="w-full py-2 bg-surface-900 text-white text-xs font-semibold rounded-lg hover:bg-surface-800 transition-colors disabled:opacity-40">Execute</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DecisionMatrix;
