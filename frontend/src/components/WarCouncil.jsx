import React, { useState, useEffect, useRef } from 'react';

const WarCouncil = ({ data }) => {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!data || !data.kpis) return;
    setMessages([]); setTyping(true);
    const stockRisk = parseInt(data.kpis.stockout_risk_days) || 15;
    const momentum = data.kpis.momentum_delta || "+0.0";

    const script = [
      { sender: 'Marketing AI', color: '#EF4444', text: `Momentum is ${momentum}. We should increase social media ad spend to capitalize on this.` },
      { sender: 'Supply Chain AI', color: '#F59E0B', text: `Be careful — stockout risk is ${stockRisk} days. If we boost demand, we'll run out of inventory.` },
      { sender: 'Finance AI', color: '#3B82F6', text: `Compromise: hold ad spend but raise prices slightly. Captures margin while controlling demand.` },
      { sender: 'Marketing AI', color: '#EF4444', text: `Agreed. Updating pricing strategy now.` },
    ];

    let step = 0;
    const timer = setInterval(() => {
      if (step < script.length) { setMessages(prev => [...prev, script[step]]); step++; if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth' }); }
      else { setTyping(false); clearInterval(timer); }
    }, 2500);
    return () => clearInterval(timer);
  }, [data]);

  if (!data) return null;

  return (
    <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-surface-900 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span> AI Strategy Discussion
        </h3>
        {typing && <span className="text-xs text-surface-400 animate-pulse">Thinking...</span>}
      </div>

      <div className="space-y-3 max-h-[250px] overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className="flex flex-col animate-[fadeIn_0.3s]">
            <span className="text-xs font-semibold mb-1" style={{ color: msg.color }}>{msg.sender}</span>
            <div className="py-2.5 px-4 bg-surface-50 rounded-xl rounded-tl-sm text-sm text-surface-700 leading-relaxed border-l-2" style={{ borderColor: msg.color }}>
              {msg.text}
            </div>
          </div>
        ))}
        {typing && messages.length < 4 && (
          <div className="flex gap-1 p-3">
            <span className="w-1.5 h-1.5 bg-surface-300 rounded-full animate-bounce"></span>
            <span className="w-1.5 h-1.5 bg-surface-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
            <span className="w-1.5 h-1.5 bg-surface-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
          </div>
        )}
        <div ref={scrollRef}></div>
      </div>
    </div>
  );
};

export default WarCouncil;
