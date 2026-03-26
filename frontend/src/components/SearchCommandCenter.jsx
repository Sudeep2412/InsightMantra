import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchCommandCenter = () => {
  const [productName, setProductName] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [sources, setSources] = useState(['ebay']);
  const [status, setStatus] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [logs, setLogs] = useState([]);
  const [isPolling, setIsPolling] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const logsEndRef = useRef(null);
  const navigate = useNavigate();

  const availableSources = ['ebay', 'snapdeal', 'shopclues', 'indiamart', 'meesho', 'nykaa', 'slickdeals'];

  const handleVoiceCommand = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { setStatus("Voice input not supported."); return; }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => { setIsListening(true); setStatus("Listening..."); };
    recognition.onresult = (event) => { const t = event.results[0][0].transcript; setProductName(t); setStatus(`Got it: "${t}"`); };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  useEffect(() => {
    let interval;
    if (isPolling) {
      interval = setInterval(async () => {
        try {
          const res = await fetch('http://localhost:2000/api/logs', { credentials: 'include' });
          if (res.ok) { const data = await res.json(); setLogs(data.logs); if (logsEndRef.current) logsEndRef.current.scrollIntoView({ behavior: 'smooth' }); }
        } catch(e) {}
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPolling]);

  const toggleSource = (src) => {
    if (sources.includes(src)) { if (sources.length > 1) setSources(sources.filter(s => s !== src)); }
    else setSources([...sources, src]);
  };

  const handleScrape = async () => {
    if (!productName) { setStatus('Please enter a product name.'); return; }
    setIsScraping(true); setStatus('Searching...');
    try {
      const res = await fetch('http://localhost:2000/api/scrape', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_name: productName, product_url: productUrl, sources })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('active_intercept_term', productName);
        setIsPolling(true);
        setStatus(`Searching ${sources.length} platform(s)... ~20 seconds.`);
        setTimeout(() => { setIsPolling(false); setStatus('Done! Loading dashboard...'); setTimeout(() => { navigate('/dashboard'); window.location.reload(); }, 2000); }, 22000);
      } else { setStatus(`Error: ${data.error}`); }
    } catch (e) { setStatus(`Connection error: ${e.message}`); }
    finally { setIsScraping(false); }
  };

  return (
    <section className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-surface-50 to-white">
      <div className="container max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-surface-900 mb-3">Product Search</h1>
          <p className="text-surface-500">Search and compare products across multiple e-commerce platforms.</p>
        </div>

        <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-8 space-y-6">
          {/* Voice btn */}
          <div className="flex justify-center">
            <button onClick={handleVoiceCommand} title="Voice input"
              className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${isListening ? 'border-red-400 bg-red-50 animate-pulse' : 'border-surface-200 bg-surface-50 hover:border-brand-400 hover:bg-brand-50'}`}>
              <svg className={`w-5 h-5 ${isListening ? 'text-red-500' : 'text-surface-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Product Name</label>
            <input type="text" placeholder="e.g. PlayStation 5 Pro" value={productName} onChange={(e) => setProductName(e.target.value)}
              className="w-full bg-surface-50 border border-surface-200 rounded-xl px-4 py-3 text-surface-900 placeholder-surface-400 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all" autoComplete="off" />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-3">Platforms</label>
            <div className="flex flex-wrap gap-2">
              {availableSources.map(src => (
                <button key={src} onClick={() => toggleSource(src)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all border ${sources.includes(src) ? 'bg-brand-50 border-brand-300 text-brand-700' : 'bg-surface-50 border-surface-200 text-surface-500 hover:border-surface-300'}`}>
                  {src}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleScrape} disabled={isScraping || isListening}
            className="w-full py-3.5 bg-surface-900 text-white font-semibold rounded-xl hover:bg-surface-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {isScraping ? "Searching..." : "Search Products"}
          </button>

          {status && (
            <div className={`text-sm text-center py-3 px-4 rounded-xl ${status.includes('Error') || status.includes('Connection') ? 'bg-red-50 text-red-600' : status.includes('Done') ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
              {status}
            </div>
          )}

          {isPolling && (
            <div className="bg-surface-50 border border-surface-200 rounded-xl p-4 h-48 overflow-y-auto font-mono text-xs text-surface-600">
              {logs.length === 0 ? <p className="animate-pulse text-surface-400">Waiting for results...</p> : null}
              {logs.map((log, i) => <div key={i} className="mb-0.5">{log}</div>)}
              <div ref={logsEndRef} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SearchCommandCenter;
