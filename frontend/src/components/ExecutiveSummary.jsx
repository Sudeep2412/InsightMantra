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
        const response = await fetch('http://localhost:2000/api/insights/generate', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data.kpis) });
        const result = await response.json();
        if (response.ok) { setSummary(result.summary); setDisplayedText(''); setIsTyping(true); }
        else { setSummary("Unable to generate insights."); setIsTyping(true); }
      } catch { setSummary("Could not connect to the AI service."); setIsTyping(true); }
      finally { setIsInitializing(false); }
    };
    fetchInsights();
  }, [data]);

  useEffect(() => {
    if (isTyping && summary.length > 0) {
      let i = 0;
      const timer = setInterval(() => { setDisplayedText(summary.slice(0, i)); i++; if (i > summary.length) { clearInterval(timer); setIsTyping(false); } }, 18);
      return () => clearInterval(timer);
    }
  }, [isTyping, summary]);

  return (
    <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <h3 className="text-sm font-semibold text-surface-900">AI Insights</h3>
        </div>
        <span className="text-xs text-surface-400">Powered by AI</span>
      </div>
      <div className="min-h-[80px] text-sm text-surface-600 leading-relaxed">
        {isInitializing ? (
          <div className="text-surface-400 animate-pulse">Generating summary...</div>
        ) : (
          <div>
            <p>{displayedText}{isTyping && <span className="inline-block w-0.5 h-4 ml-0.5 bg-brand-500 animate-pulse"></span>}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutiveSummary;
