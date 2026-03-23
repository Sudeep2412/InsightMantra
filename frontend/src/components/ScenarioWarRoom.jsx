import React, { useState, useEffect, useRef, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const ScenarioWarRoom = ({ onSimulate, isSimulating }) => {
  const [priceShock, setPriceShock] = useState(1.0);
  const [sentimentShock, setSentimentShock] = useState(1.0);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 300 });

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: 300
      });
    }
  }, []);

  const handleSimulateBtn = () => {
    onSimulate(priceShock, sentimentShock);
  };

  const resetSliders = () => {
    setPriceShock(1.0);
    setSentimentShock(1.0);
    onSimulate(1.0, 1.0);
  };

  const graphData = useMemo(() => {
    const demandScale = Math.max(0.5, 2.0 - priceShock + (sentimentShock - 1.0));
    const stockScale = 1.0 / demandScale;

    return {
      nodes: [
        { id: 'Price', group: 1, val: priceShock * 10, color: '#b026ff' },
        { id: 'Sentiment', group: 2, val: sentimentShock * 10, color: '#ffb800' },
        { id: 'Demand', group: 3, val: demandScale * 15, color: '#00ff88' },
        { id: 'Stockout', group: 4, val: stockScale * 12, color: stockScale < 0.8 ? '#ff0055' : '#00f0ff' },
        { id: 'Margin', group: 5, val: priceShock * demandScale * 12, color: '#f472b6' }
      ],
      links: [
        { source: 'Price', target: 'Demand', value: Math.abs(1 - priceShock) * 5 + 1 },
        { source: 'Sentiment', target: 'Demand', value: Math.abs(1 - sentimentShock) * 5 + 1 },
        { source: 'Demand', target: 'Stockout', value: demandScale * 3 },
        { source: 'Demand', target: 'Margin', value: demandScale * 2 },
        { source: 'Price', target: 'Margin', value: priceShock * 3 }
      ]
    };
  }, [priceShock, sentimentShock]);

  return (
    <div className="w-full mt-10 bg-[#0a0a0f]/90 backdrop-blur-xl border border-[#ffb800]/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(255,184,0,0.05)]">
      <div className="flex items-center mb-6">
        <span className="w-3 h-3 bg-[#ffb800] rounded-full mr-4 animate-pulse"></span>
        <h2 className="text-xl font-extrabold text-[#ffb800] font-mono tracking-[0.2em] uppercase">Butterfly Effect Simulator</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="bg-[#121218] border border-white/5 p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffb800]/5 blur-3xl rounded-full pointer-events-none"></div>

          <div className="space-y-8 relative z-10">
            <div>
              <div className="flex justify-between text-xs font-mono font-bold text-gray-400 mb-4 px-1">
                <span className="tracking-widest">ALGORITHMIC PRICING SHIFT</span>
                <span className={priceShock < 1 ? 'text-[#ff0055]' : 'text-[#00ff88]'}>{(priceShock * 100 - 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" 
                min="0.5" max="1.5" step="0.05"
                value={priceShock}
                onChange={e => setPriceShock(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#b026ff] [&::-webkit-slider-thumb]:shadow-[0_0_10px_#b026ff] [&::-webkit-slider-thumb]:rounded-full"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono font-bold text-gray-400 mb-4 px-1">
                <span className="tracking-widest">SENTIMENT VECTOR INJECTION</span>
                <span className={sentimentShock < 1 ? 'text-[#ff0055]' : 'text-[#00ff88]'}>{(sentimentShock * 100 - 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" 
                min="0.5" max="1.5" step="0.05"
                value={sentimentShock}
                onChange={e => setSentimentShock(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#ffb800] [&::-webkit-slider-thumb]:shadow-[0_0_10px_#ffb800] [&::-webkit-slider-thumb]:rounded-full"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={handleSimulateBtn}
                disabled={isSimulating}
                className="flex-1 py-3 bg-transparent border border-[#ffb800] text-[#ffb800] font-mono text-xs font-bold tracking-widest uppercase hover:bg-[#ffb800]/10 hover:shadow-[0_0_20px_rgba(255,184,0,0.2)] transition-all disabled:opacity-50"
              >
                {isSimulating ? 'SIMULATING TRAJECTORY...' : 'RUN KINETIC SIMULATION'}
              </button>
              <button 
                onClick={resetSliders}
                disabled={isSimulating}
                className="px-6 py-3 bg-gray-900 border border-gray-700 text-gray-500 font-mono text-[10px] tracking-widest uppercase hover:text-white transition-colors"
                title="Reset to Baseline"
              >
                RST
              </button>
            </div>
          </div>
        </div>

        <div ref={containerRef} className="bg-black border border-white/5 rounded-xl flex items-center justify-center relative py-4" style={{ minHeight: '300px', overflow: 'hidden' }}>
          <div className="absolute top-2 left-2 text-[9px] text-[#00f0ff] font-mono tracking-widest z-10 opacity-70">
            &gt; NODE KINETICS ACTIVE
          </div>
          <ForceGraph2D
            width={dimensions.width - 32}
            height={dimensions.height}
            graphData={graphData}
            nodeLabel="id"
            nodeColor={node => node.color}
            nodeRelSize={1.5}
            linkColor={() => 'rgba(255,255,255,0.1)'}
            linkWidth={link => link.value}
            d3AlphaDecay={0.02}
            d3VelocityDecay={0.3}
            backgroundColor="#000000"
          />
        </div>

      </div>
    </div>
  );
}

export default ScenarioWarRoom;
