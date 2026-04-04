import React, { useState, useEffect, useCallback } from 'react';

const LiveSentimentFeed = ({ data }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ positive: 0, neutral: 0, negative: 0 });
  const [visibleIdx, setVisibleIdx] = useState(0);

  // Fetch reviews from the API — polls every 8 seconds for live updates
  const loadReviews = useCallback(async () => {
    try {
      const activeTerm = localStorage.getItem('active_intercept_term') || '';
      const res = await fetch(`http://localhost:2000/api/reviews?term=${encodeURIComponent(activeTerm)}`, { credentials: 'include' });
      console.log('[LiveSentiment] API status:', res.status, 'term:', activeTerm);
      if (!res.ok) { console.log('[LiveSentiment] API not OK, status:', res.status); return; }
      const fetchedData = await res.json();
      console.log('[LiveSentiment] Reviews received:', fetchedData?.length || 0);
      if (!fetchedData || !Array.isArray(fetchedData) || fetchedData.length === 0) return;

      // Calculate stats (excluding fake reviews)
      let pos = 0, neu = 0, neg = 0;
      fetchedData.forEach(r => {
        if (!r || r.is_fake) return;
        const s = (r.sentiment || '').toLowerCase();
        if (s.includes('pos')) pos++;
        else if (s.includes('neg')) neg++;
        else neu++;
      });
      const total = pos + neu + neg || 1;
      setStats({
        positive: Math.round((pos / total) * 100),
        neutral: Math.round((neu / total) * 100),
        negative: Math.round((neg / total) * 100)
      });

      setReviews(fetchedData.slice(0, 20));
    } catch (e) {
      console.error('[LiveSentiment] Fetch error:', e);
    }
  }, []);

  useEffect(() => {
    loadReviews();
    const pollInterval = setInterval(loadReviews, 8000);
    return () => clearInterval(pollInterval);
  }, [loadReviews]);

  // Cycle through visible reviews every 4 seconds
  useEffect(() => {
    if (reviews.length < 2) return;
    const interval = setInterval(() => {
      setVisibleIdx(prev => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const getSentimentStyle = (sentiment) => {
    const s = (sentiment || '').toLowerCase();
    if (s.includes('pos')) return { border: 'border-[#00ff88]', text: 'text-[#00ff88]', icon: '▲', label: 'POSITIVE' };
    if (s.includes('neg')) return { border: 'border-[#ff0055]', text: 'text-[#ff0055]', icon: '▼', label: 'NEGATIVE' };
    return { border: 'border-[#00f0ff]', text: 'text-[#00f0ff]', icon: '◿', label: 'NEUTRAL' };
  };

  // Show waiting state if no reviews loaded yet
  if (reviews.length === 0) return (
    <div className="w-full mt-8 bg-[#0a0a0f]/90 backdrop-blur-xl border border-[#00f0ff]/20 rounded-2xl p-10 shadow-[0_0_30px_rgba(0,240,255,0.05)] text-center">
      <div className="text-[#00f0ff] font-mono tracking-[0.3em] text-sm animate-pulse mb-3">⟳ AWAITING SENTIMENT DATA...</div>
      <p className="text-gray-500 font-mono text-xs tracking-widest">Scraper nodes are collecting reviews. This feed will auto-populate when data arrives.</p>
    </div>
  );

  // Get 3 visible reviews starting from visibleIdx
  const getVisibleReviews = () => {
    const visible = [];
    for (let i = 0; i < Math.min(3, reviews.length); i++) {
      const idx = (visibleIdx + i) % reviews.length;
      const r = reviews[idx];
      if (r) visible.push({ ...r, _idx: idx });
    }
    return visible;
  };

  return (
    <div className="w-full mt-8 bg-[#0a0a0f]/90 backdrop-blur-xl border border-[#00f0ff]/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,240,255,0.05)] relative overflow-hidden flex flex-col md:flex-row gap-6">
      
      {/* Left Panel: Aggregate Stats */}
      <div className="w-full md:w-1/3 flex flex-col justify-center relative z-10 border-r border-white/5 pr-6 p-4 rounded-xl">
        <h2 className="text-xl md:text-2xl font-extrabold text-[#00f0ff] font-mono tracking-[0.2em] flex items-center mb-6">
          <span className="w-3 h-3 bg-[#00ff88] rounded-sm mr-4 animate-[ping_2s_infinite]"></span>
          LIVE SENTIMENT
        </h2>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-xs font-mono font-bold text-gray-400 mb-2">
              <span>POSITIVE TRACE</span>
              <span className="text-[#00ff88]">{stats.positive}%</span>
            </div>
            <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-[#00ff88] shadow-[0_0_15px_#00ff88] transition-all duration-1000" style={{width: `${stats.positive}%`}}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs font-mono font-bold text-gray-400 mb-2">
              <span>NEUTRAL NOISE</span>
              <span className="text-[#00f0ff]">{stats.neutral}%</span>
            </div>
            <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-[#00f0ff] shadow-[0_0_15px_#00f0ff] transition-all duration-1000" style={{width: `${stats.neutral}%`}}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs font-mono font-bold text-gray-400 mb-2">
              <span>NEGATIVE IMPACT</span>
              <span className="text-[#ff0055]">{stats.negative}%</span>
            </div>
            <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-[#ff0055] shadow-[0_0_15px_#ff0055] transition-all duration-1000" style={{width: `${stats.negative}%`}}></div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-[10px] font-mono text-gray-600 tracking-widest">
          TOTAL REVIEWS: {reviews.length} | FAKE DETECTED: {reviews.filter(r => r && r.is_fake).length}
        </div>
      </div>

      {/* Right Panel: Streaming Reviews */}
      <div className="w-full md:w-2/3 h-[300px] relative z-10 overflow-hidden p-4 rounded-xl border border-white/5" style={{maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'}}>
        <div className="flex flex-col gap-3 transition-all duration-500 ease-in-out">
          {getVisibleReviews().map((review) => {
            const style = getSentimentStyle(review.sentiment);
            return (
              <div 
                key={`review-${review.id}-${review._idx}`} 
                className={`w-full p-4 bg-[#121218]/90 border-l-4 ${style.border} rounded-r-lg flex flex-col transition-all duration-700 shadow-[0_4px_20px_rgba(0,0,0,0.5)]`}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-gray-500">Incoming Telemetry \\ ID:{review.id}</span>
                  <div className="flex gap-2">
                    {review.is_fake && (
                      <span className="text-[11px] font-bold font-mono tracking-widest text-[#ff0055] flex items-center bg-[#ff0055]/10 border border-[#ff0055]/30 px-2 py-1 rounded animate-pulse shadow-[0_0_10px_rgba(255,0,85,0.4)]">
                        ⚠ FAKE BOT
                      </span>
                    )}
                    <span className={`text-[11px] font-bold font-mono tracking-widest ${style.text} flex items-center bg-white/5 px-2 py-1 rounded`}>
                      {style.icon} {style.label}
                    </span>
                  </div>
                </div>
                <p className="text-gray-300 text-sm font-mono leading-relaxed line-clamp-2">{review.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LiveSentimentFeed;
