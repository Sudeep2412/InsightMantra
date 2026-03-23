import React, { useState, useEffect, useMemo } from 'react';
import Globe from 'react-globe.gl';

const fallbackReviews = [
  { id: 101, body: "Absolutely phenomenal build quality. Exceeded expectations.", sentiment: "Positive", lat: 40.7, lng: -74.0 },
  { id: 102, body: "Packaging was severely damaged upon arrival. Very disappointed.", sentiment: "Negative", lat: 51.5, lng: -0.1 },
  { id: 103, body: "It's decent for the price point. Does what it says.", sentiment: "Neutral", lat: 35.6, lng: 139.6 },
  { id: 104, body: "Materials feel somewhat cheap for a flagship model.", sentiment: "Negative", lat: -33.8, lng: 151.2 },
  { id: 105, body: "Customer support replaced my unit instantly. 10/10 service!", sentiment: "Positive", lat: 28.6, lng: 77.2 },
  { id: 106, body: "Average product. Unremarkable but functional.", sentiment: "Neutral", lat: 48.8, lng: 2.3 },
  { id: 107, body: "The algorithm is incredibly accurate, saving me hours of work.", sentiment: "Positive", lat: 37.7, lng: -122.4 },
];

const LiveSentimentFeed = ({ data }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ positive: 0, neutral: 0, negative: 0 });
  const [globeWidth, setGlobeWidth] = useState(300);

  useEffect(() => {
    const handleResize = () => setGlobeWidth(window.innerWidth < 768 ? window.innerWidth - 60 : 350);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const arcsData = useMemo(() => {
    return reviews.map((r) => ({
      startLat: (Math.random() - 0.5) * 180,
      startLng: (Math.random() - 0.5) * 360,
      endLat: r.lat || 0,
      endLng: r.lng || 0,
      color: r.sentiment === 'Positive' ? '#00ff88' : r.sentiment === 'Negative' ? '#ff0055' : '#00f0ff'
    }));
  }, [reviews]);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const res = await fetch('http://localhost:2000/api/reviews', { credentials: 'include' });
        if (res.ok) {
          const fetchedData = await res.json();
          if (fetchedData && fetchedData.length > 0) {
            processReviews(fetchedData);
            return;
          }
        }
      } catch(e) {}
      processReviews(fallbackReviews);
    };
    loadReviews();
  }, []);

  const processReviews = (reviewData) => {
    let pos = 0, neu = 0, neg = 0;
    reviewData.forEach(r => {
      const s = r.sentiment ? r.sentiment.toLowerCase() : '';
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

    setReviews(reviewData.slice(0, 15));
  };

  useEffect(() => {
    if (reviews.length === 0) return;
    const interval = setInterval(() => {
      setReviews(prev => {
        const current = [...prev];
        const last = current.pop();
        current.unshift(last);
        return current;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const getSentimentStyle = (sentiment) => {
    const s = sentiment ? sentiment.toLowerCase() : '';
    if (s.includes('pos')) return { border: 'border-[#00ff88]', text: 'text-[#00ff88]', icon: '▲' };
    if (s.includes('neg')) return { border: 'border-[#ff0055]', text: 'text-[#ff0055]', icon: '▼' };
    return { border: 'border-[#00f0ff]', text: 'text-[#00f0ff]', icon: '◿' };
  };

  if (reviews.length === 0) return null;

  return (
    <div className="w-full mt-8 bg-[#0a0a0f]/90 backdrop-blur-xl border border-[#00f0ff]/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,240,255,0.05)] relative overflow-hidden flex flex-col md:flex-row gap-6">
      {/* Background 3D Globe */}
      <div className="absolute inset-0 opacity-40 z-0 flex items-center justify-center lg:justify-start lg:pl-10 pointer-events-none">
        <Globe
          width={globeWidth}
          height={globeWidth}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
          arcsData={arcsData}
          arcColor="color"
          arcDashLength={() => Math.random() * 0.5 + 0.1}
          arcDashGap={() => Math.random() * 0.5 + 0.1}
          arcDashAnimateTime={() => Math.random() * 4000 + 1000}
          backgroundColor="rgba(0,0,0,0)"
        />
      </div>
      
      {/* Left Panel: Aggregate Stats */}
      <div className="w-full md:w-1/3 flex flex-col justify-center relative z-10 border-r border-white/5 pr-6 bg-black/40 backdrop-blur-sm p-4 rounded-xl">
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
              <div className="h-full bg-[#00ff88] shadow-[0_0_15px_#00ff88]" style={{width: `${stats.positive}%`}}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs font-mono font-bold text-gray-400 mb-2">
              <span>NEUTRAL NOISE</span>
              <span className="text-[#00f0ff]">{stats.neutral}%</span>
            </div>
            <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-[#00f0ff] shadow-[0_0_15px_#00f0ff]" style={{width: `${stats.neutral}%`}}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs font-mono font-bold text-gray-400 mb-2">
              <span>NEGATIVE IMPACT</span>
              <span className="text-[#ff0055]">{stats.negative}%</span>
            </div>
            <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-[#ff0055] shadow-[0_0_15px_#ff0055]" style={{width: `${stats.negative}%`}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Streaming Reviews */}
      <div className="w-full md:w-2/3 h-[300px] relative z-10 overflow-hidden bg-black/30 backdrop-blur-sm p-4 rounded-xl border border-white/5" style={{maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'}}>
        <div className="flex flex-col gap-3 transition-all duration-500 ease-in-out">
          {reviews.map((review, idx) => {
            const style = getSentimentStyle(review.sentiment);
            return (
              <div 
                key={`${review.id}-${idx}`} 
                className={`w-full p-4 bg-[#121218]/90 border-l-4 ${style.border} rounded-r-lg flex flex-col transition-all duration-700 animate-[fadeIn_0.5s_ease-out] shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:bg-[#1a1a24] hover:shadow-[0_0_15px_${style.border.split('-')[1]}]`}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-gray-500">Incoming Telemetry \\ ID:{review.id}</span>
                  <span className={`text-[11px] font-bold font-mono tracking-widest ${style.text} flex items-center bg-white/5 px-2 py-1 rounded`}>
                    {style.icon} {review.sentiment?.toUpperCase()}
                  </span>
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
