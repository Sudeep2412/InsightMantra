import React, { useState, useEffect } from 'react';

const ExecutiveSummary = ({ data }) => {
  const [summary, setSummary] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (!data) return;

    const fetchInsights = async () => {
      setIsInitializing(true);
      try {
        const response = await fetch('http://localhost:2000/api/insights/generate', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data.kpis)
        });
        
        const result = await response.json();
        if (response.ok) {
          setSummary(result.summary);
          setDisplayedText('');
          setIsTyping(true);
        } else {
          setSummary("SYS_ERR: Unable to connect to LLM Matrix.");
          setIsTyping(true);
        }
      } catch (error) {
        setSummary("OFFLINE: Neural uplink severed. Check API keys and backend.");
        setIsTyping(true);
      } finally {
        setIsInitializing(false);
      }
    };

    fetchInsights();
  }, [data]);

  useEffect(() => {
    if (isTyping && summary.length > 0) {
      let i = 0;
      const timer = setInterval(() => {
        setDisplayedText(summary.slice(0, i));
        i++;
        if (i > summary.length) {
          clearInterval(timer);
          setIsTyping(false);
        }
      }, 20); // Typewriter speed
      return () => clearInterval(timer);
    }
  }, [isTyping, summary]);

  return (
    <div className="relative mt-8 group">
      {/* Animated glowing border */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 via-purple-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
      
      <div className="relative bg-n-8/90 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="h-3 w-3 bg-red-500 rounded-full animate-ping"></div>
            <h3 className="text-white font-code font-bold tracking-[0.2em] text-xs md:text-sm uppercase">
              God-Mode Tactical HUD <span className="text-red-400 ml-2">[ACTIVE OVERRIDE]</span>
            </h3>
          </div>
          <div className="text-xs font-mono text-cyan-400 opacity-70">
            MODEL: GEMINI-PRO-VISION
          </div>
        </div>

        <div className="min-h-[120px] font-mono text-sm leading-relaxed tracking-wide text-n-3">
          {isInitializing ? (
            <div className="flex items-center h-full text-purple-400 opacity-80 animate-pulse">
              &gt; Synthesizing raw telemetry. Querying LLM framework...
            </div>
          ) : (
            <div className="flex flex-col space-y-3">
              <span className="text-green-400">&gt; COMMAND DIRECTIVE GENERATED:</span>
              <p className="text-white leading-loose">
                {displayedText}
                {isTyping && <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-pulse"></span>}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSummary;
