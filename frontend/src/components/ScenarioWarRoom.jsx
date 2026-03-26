import React, { useState, useEffect, useRef, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const ScenarioWarRoom = ({ onSimulate, isSimulating }) => {
  const [priceShock, setPriceShock] = useState(1.0);
  const [sentimentShock, setSentimentShock] = useState(1.0);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 280 });

  useEffect(() => { if (containerRef.current) setDimensions({ width: containerRef.current.clientWidth, height: 280 }); }, []);

  const handleSimulateBtn = () => onSimulate(priceShock, sentimentShock);
  const resetSliders = () => { setPriceShock(1.0); setSentimentShock(1.0); onSimulate(1.0, 1.0); };

  const graphData = useMemo(() => {
    const demandScale = Math.max(0.5, 2.0 - priceShock + (sentimentShock - 1.0));
    const stockScale = 1.0 / demandScale;
    return {
      nodes: [
        { id: 'Price', group: 1, val: priceShock * 10, color: '#8B5CF6' },
        { id: 'Sentiment', group: 2, val: sentimentShock * 10, color: '#F59E0B' },
        { id: 'Demand', group: 3, val: demandScale * 15, color: '#10B981' },
        { id: 'Stockout', group: 4, val: stockScale * 12, color: stockScale < 0.8 ? '#EF4444' : '#3B82F6' },
        { id: 'Margin', group: 5, val: priceShock * demandScale * 12, color: '#EC4899' }
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
    <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-6 mt-6">
      <h3 className="text-sm font-semibold text-surface-900 mb-6 flex items-center gap-2">
        <span className="w-2 h-2 bg-amber-500 rounded-full"></span> Scenario Simulator
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-xs font-medium text-surface-600 mb-2">
              <span>Price Change</span>
              <span className={priceShock < 1 ? 'text-red-500' : 'text-emerald-600'}>{(priceShock * 100 - 100).toFixed(0)}%</span>
            </div>
            <input type="range" min="0.5" max="1.5" step="0.05" value={priceShock} onChange={e => setPriceShock(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-surface-100 rounded-lg appearance-none cursor-pointer accent-violet-500" />
          </div>
          <div>
            <div className="flex justify-between text-xs font-medium text-surface-600 mb-2">
              <span>Sentiment Change</span>
              <span className={sentimentShock < 1 ? 'text-red-500' : 'text-emerald-600'}>{(sentimentShock * 100 - 100).toFixed(0)}%</span>
            </div>
            <input type="range" min="0.5" max="1.5" step="0.05" value={sentimentShock} onChange={e => setSentimentShock(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-surface-100 rounded-lg appearance-none cursor-pointer accent-amber-500" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSimulateBtn} disabled={isSimulating}
              className="flex-1 py-2.5 bg-surface-900 text-white text-sm font-semibold rounded-xl hover:bg-surface-800 transition-colors disabled:opacity-50">
              {isSimulating ? 'Simulating...' : 'Run Simulation'}
            </button>
            <button onClick={resetSliders} disabled={isSimulating}
              className="px-4 py-2.5 bg-surface-100 text-surface-600 text-sm rounded-xl hover:bg-surface-200 transition-colors" title="Reset">
              Reset
            </button>
          </div>
        </div>

        <div ref={containerRef} className="bg-surface-50 border border-surface-100 rounded-xl flex items-center justify-center" style={{ minHeight: '280px', overflow: 'hidden' }}>
          <ForceGraph2D width={dimensions.width - 48} height={dimensions.height} graphData={graphData} nodeLabel="id" nodeColor={node => node.color} nodeRelSize={1.5}
            linkColor={() => 'rgba(168,162,158,0.2)'} linkWidth={link => link.value} d3AlphaDecay={0.02} d3VelocityDecay={0.3} backgroundColor="#FAFAF9" />
        </div>
      </div>
    </div>
  );
};

export default ScenarioWarRoom;
