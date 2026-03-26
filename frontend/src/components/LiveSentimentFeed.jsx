import React, { useState, useEffect, useMemo } from 'react';
import Globe from 'react-globe.gl';

const fallbackReviews = [
  { id: 101, body: "Absolutely phenomenal build quality.", sentiment: "Positive", lat: 40.7, lng: -74.0 },
  { id: 102, body: "Packaging was damaged. Very disappointed.", sentiment: "Negative", lat: 51.5, lng: -0.1 },
  { id: 103, body: "Decent for the price. Does what it says.", sentiment: "Neutral", lat: 35.6, lng: 139.6 },
  { id: 104, body: "Materials feel cheap for a flagship.", sentiment: "Negative", lat: -33.8, lng: 151.2 },
  { id: 105, body: "Customer support was excellent. 10/10!", sentiment: "Positive", lat: 28.6, lng: 77.2 },
  { id: 106, body: "Average product. Functional but unremarkable.", sentiment: "Neutral", lat: 48.8, lng: 2.3 },
  { id: 107, body: "Incredibly accurate, saving hours of work.", sentiment: "Positive", lat: 37.7, lng: -122.4 },
];

const LiveSentimentFeed = ({ data }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ positive: 0, neutral: 0, negative: 0 });

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const res = await fetch('http://localhost:2000/api/reviews', { credentials: 'include' });
        if (res.ok) { const d = await res.json(); if (d?.length > 0) { processReviews(d); return; } }
      } catch {}
      processReviews(fallbackReviews);
    };
    loadReviews();
  }, []);

  const processReviews = (reviewData) => {
    let pos = 0, neu = 0, neg = 0;
    reviewData.forEach(r => { const s = (r.sentiment || '').toLowerCase(); if (s.includes('pos')) pos++; else if (s.includes('neg')) neg++; else neu++; });
    const total = pos + neu + neg || 1;
    setStats({ positive: Math.round((pos/total)*100), neutral: Math.round((neu/total)*100), negative: Math.round((neg/total)*100) });
    setReviews(reviewData.slice(0, 10));
  };

  useEffect(() => {
    if (reviews.length === 0) return;
    const interval = setInterval(() => setReviews(prev => { const c = [...prev]; const l = c.pop(); c.unshift(l); return c; }), 4000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const getSentimentStyle = (sentiment) => {
    const s = (sentiment || '').toLowerCase();
    if (s.includes('pos')) return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', icon: '↑' };
    if (s.includes('neg')) return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', icon: '↓' };
    return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', icon: '→' };
  };

  if (reviews.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-6 mt-6">
      <h3 className="text-sm font-semibold text-surface-900 mb-5 flex items-center gap-2">
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Review Sentiment
      </h3>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Stats */}
        <div className="w-full md:w-1/3 space-y-4">
          {[
            { label: 'Positive', value: stats.positive, color: '#10B981', bg: 'bg-emerald-500' },
            { label: 'Neutral', value: stats.neutral, color: '#3B82F6', bg: 'bg-blue-500' },
            { label: 'Negative', value: stats.negative, color: '#EF4444', bg: 'bg-red-500' },
          ].map((s, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs font-medium text-surface-600 mb-1.5">
                <span>{s.label}</span>
                <span style={{ color: s.color }}>{s.value}%</span>
              </div>
              <div className="w-full h-1.5 bg-surface-100 rounded-full overflow-hidden">
                <div className={`h-full ${s.bg} rounded-full transition-all duration-700`} style={{ width: `${s.value}%` }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Reviews */}
        <div className="w-full md:w-2/3 max-h-[240px] overflow-y-auto space-y-2">
          {reviews.map((review, idx) => {
            const style = getSentimentStyle(review.sentiment);
            return (
              <div key={`${review.id}-${idx}`} className={`p-3 ${style.bg} border ${style.border} rounded-xl`}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-surface-400">Review #{review.id}</span>
                  <span className={`text-xs font-semibold ${style.text}`}>{style.icon} {review.sentiment}</span>
                </div>
                <p className="text-sm text-surface-700 leading-relaxed line-clamp-2">{review.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LiveSentimentFeed;
