import React, { useState, useEffect, useRef } from 'react';

const WarCouncil = ({ data }) => {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!data || !data.kpis) return;
    
    setMessages([]);
    setTyping(true);

    const stockRisk = parseInt(data.kpis.stockout_risk_days) || 15;
    const momentum = data.kpis.momentum_delta || "+0.0";
    
    const script = [
      { 
        sender: 'AI_CMO (Marketing)', 
        color: '#ff0055', 
        text: `Momentum reads ${momentum}. I strongly recommend we deploy +$30k into top-of-funnel TikTok ads immediately to capture this variance.` 
      },
      { 
        sender: 'AI_CSCO (Supply Chain)', 
        color: '#ffb800', 
        text: `Negative. If we spike demand now, our Stockout Risk of ${stockRisk} days will collapse to zero. We don't have the inventory buffer.` 
      },
      { 
        sender: 'AI_CFO (Fintech)', 
        color: '#00f0ff', 
        text: `Compromise matrix: We hold ad-spend, but execute algorithmic price hike. We capture the momentum margin while naturally throttling the demand spike. Win-win.` 
      },
      { 
        sender: 'AI_CMO (Marketing)', 
        color: '#ff0055', 
        text: `Acceptable. Updating localized dynamic pricing APIs now.` 
      }
    ];

    let step = 0;
    const timer = setInterval(() => {
      if (step < script.length) {
        setMessages(prev => [...prev, script[step]]);
        step++;
        if (containerRef.current) {
          containerRef.current.scrollTo({
            top: containerRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      } else {
        setTyping(false);
        clearInterval(timer);
      }
    }, 3500); // 3.5s per message

    return () => clearInterval(timer);
  }, [data]);

  if (!data) return null;

  return (
    <div className="w-full mt-10 bg-[#0a0a0f]/90 backdrop-blur-xl border border-[#00f0ff]/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,240,255,0.05)] relative overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
        <h2 className="text-xl font-extrabold text-white font-mono tracking-[0.2em] flex items-center">
          <span className="w-2 h-2 bg-[#ff0055] mr-1 animate-pulse"></span>
          <span className="w-2 h-2 bg-[#ffb800] mr-1 animate-pulse delay-75"></span>
          <span className="w-2 h-2 bg-[#00f0ff] mr-4 animate-pulse delay-150"></span>
          AUTONOMOUS WAR COUNCIL
        </h2>
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#00ff88] border border-[#00ff88]/30 px-2 py-1 rounded bg-[#00ff88]/10">
          Neural Dispute Active
        </span>
      </div>

      <div ref={containerRef} className="flex flex-col space-y-4 h-[250px] overflow-y-auto pr-2" style={{maskImage: 'linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)'}}>
        <div className="pt-4"></div>
        {messages.map((msg, i) => (
          <div key={i} className="flex flex-col animate-[fadeIn_0.5s_ease-out]">
            <span className="text-[10px] font-bold font-mono tracking-widest mb-1" style={{color: msg.color}}>
              &gt; {msg.sender}
            </span>
            <div className="p-3 bg-[#121218] border border-white/5 rounded-r-xl rounded-bl-xl text-gray-300 text-sm font-mono leading-relaxed" style={{borderLeft: `2px solid ${msg.color}`}}>
              {msg.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex flex-col mt-2">
             <span className="text-[10px] font-bold font-mono tracking-widest mb-1 text-gray-500">
              &gt; AI_NODE_TYPING...
            </span>
            <div className="flex space-x-1 p-2 w-12 items-center justify-center bg-[#121218] border border-white/5 rounded-r-xl rounded-bl-xl border-l-[2px] border-l-gray-600">
              <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
              <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
            </div>
          </div>
        )}
        <div className="pb-4"></div>
      </div>
    </div>
  );
};

export default WarCouncil;
