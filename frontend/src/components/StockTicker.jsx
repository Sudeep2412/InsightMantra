import React, { useState, useEffect } from 'react';

const initialStocks = [
  // US Tech Giants
  { symbol: 'AAPL', price: 185.50, change: 1.2 },
  { symbol: 'NVDA', price: 462.41, change: 3.8 },
  { symbol: 'AMZN', price: 138.23, change: 0.9 },
  
  // Indian Markets (BSE/NSE)
  { symbol: 'RELIANCE.BO', price: 2980.15, change: 1.4 },
  { symbol: 'TCS.NS', price: 4120.60, change: -0.8 },
  { symbol: 'HDFCBANK.NS', price: 1450.20, change: 0.5 },
  
  // European Markets (Euronext/DAX)
  { symbol: 'SAP.DE', price: 168.40, change: 2.1 },
  { symbol: 'ASML.AS', price: 820.50, change: -1.2 },
  { symbol: 'LVMH.PA', price: 835.10, change: 0.7 },
  
  // Australian Markets (ASX)
  { symbol: 'BHP.AX', price: 45.80, change: 1.1 },
  { symbol: 'CBA.AX', price: 114.25, change: -0.3 },
  { symbol: 'CSL.AX', price: 285.40, change: 1.8 },
  
  // Mixed Global
  { symbol: 'TSLA', price: 238.82, change: 2.1 },
  { symbol: 'INFY.NS', price: 1650.30, change: 0.4 },
];

const StockTicker = () => {
  const [stocks, setStocks] = useState(initialStocks);

  // Simulate real-time price fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(currentStocks => 
        currentStocks.map(stock => {
          // Randomly fluctuate between -0.5% and +0.5%
          const fluctuation = stock.price * (Math.random() * 0.01 - 0.005);
          const newPrice = stock.price + fluctuation;
          const newChange = stock.change + (fluctuation > 0 ? 0.1 : -0.1);
          return {
            ...stock,
            price: Number(newPrice.toFixed(2)),
            change: Number(newChange.toFixed(2))
          };
        })
      );
    }, 2500); // Update every 2.5 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#050508] border-b border-[#00f0ff]/20 overflow-hidden relative z-50 flex items-center h-10 shadow-[0_4px_20px_rgba(0,240,255,0.1)]">
      <style>
        {`
          @keyframes tickerMove {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .ticker-track {
            display: flex;
            width: 200%;
            animation: tickerMove 40s linear infinite;
          }
          .ticker-track:hover {
            animation-play-state: paused;
          }
        `}
      </style>
      
      {/* Decorative label */}
      <div className="absolute left-0 top-0 h-full bg-[#0a0a0f] border-r border-[#00f0ff]/30 px-4 flex items-center z-10 shadow-[10px_0_20px_#050508]">
        <div className="w-2 h-2 rounded-full bg-[#ff0055] animate-pulse mr-2"></div>
        <span className="text-[#00f0ff] font-mono text-xs font-bold tracking-widest whitespace-nowrap">LIVE GLOBAL TICKER</span>
      </div>

      <div className="ticker-track pl-48">
        {/* Double array to create seamless infinite loop */}
        {[...stocks, ...stocks].map((stock, idx) => (
          <div key={idx} className="flex items-center space-x-2 px-6 border-r border-white/5 whitespace-nowrap">
            <span className="font-mono text-xs font-bold text-gray-300">{stock.symbol}</span>
            <span className="font-mono text-sm font-black text-white">${stock.price.toFixed(2)}</span>
            <span className={`font-mono text-xs font-bold ${stock.change >= 0 ? 'text-[#00ff88]' : 'text-[#ff0055]'}`}>
              {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.change).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockTicker;
