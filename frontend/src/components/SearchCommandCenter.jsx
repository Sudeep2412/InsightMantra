import React, { useState, useEffect, useRef } from 'react';
import Section from './Section';
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

  // JARVIS Voice Protocol Setup
  const handleVoiceCommand = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatus("Neural Voice API not supported by this browser vector.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      setIsListening(true);
      setStatus("J.A.R.V.I.S Protocol Active: Awaiting verbal telemetry...");
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setProductName(transcript);
      setStatus(`Voice Match Verified: "${transcript}". Awaiting authorization to launch...`);
    };

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
          if (res.ok) {
            const data = await res.json();
            setLogs(data.logs);
            if(logsEndRef.current) logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        } catch(e) {}
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPolling]);

  const toggleSource = (src) => {
    if (sources.includes(src)) {
      if (sources.length > 1) {
        setSources(sources.filter((s) => s !== src));
      }
    } else {
      setSources([...sources, src]);
    }
  };

  const handleScrape = async () => {
    if (!productName) {
      setStatus('Target keyword is strictly required for interception.');
      return;
    }

    setIsScraping(true);
    setStatus('Initializing Neural Scraper Nodes...');

    try {
      const res = await fetch('http://localhost:2000/api/scrape', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_name: productName, product_url: productUrl, sources: sources })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('active_intercept_term', productName);
        setIsPolling(true);
        setStatus(`Intercept sequence launched! Penetrating target nodes... (ETA: 20s)`);
        setTimeout(() => {
            setIsPolling(false);
            setStatus('Data Fusion Complete. Booting Dashboard...');
            setTimeout(() => {
              navigate('/dashboard');
              window.location.reload();
            }, 2000);
        }, 22000);
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (e) {
      setStatus(`System Error: ${e.message}`);
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <Section id="command-center" className="py-20 min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[#050508] -z-10"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg2MHY2MEgwaC0xbS41LjVWMGMwIC41LjUuNS41LjV6IiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZT0iIzAyMzZkMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] pointer-events-none opacity-20 -z-10"></div>
      
      <div className="container mx-auto px-4 z-10 relative">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black mb-4 font-mono tracking-tighter text-white drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
            GLOBAL <span className="text-[#00f0ff]">DATA INTERCEPT</span>
          </h2>
          <p className="text-gray-400 font-mono tracking-widest text-sm md:text-base">
            Deploy thousands of simultaneous crawler nodes. Secure target lock.
          </p>
        </div>

        <div className="max-w-[800px] mx-auto bg-[#0a0a0f]/80 backdrop-blur-xl border border-[#00f0ff]/30 rounded-[2rem] p-8 md:p-12 shadow-[0_0_80px_rgba(0,240,255,0.15)] relative overflow-hidden group">
          
          <div className="absolute -inset-1 bg-gradient-to-r from-[#00f0ff]/10 to-[#ff0055]/10 rounded-[2rem] blur opacity-50 group-hover:opacity-100 transition duration-1000"></div>
          
          <div className="flex flex-col space-y-8 relative z-10">
            {/* J.A.R.V.I.S VOICE COMM MODULE */}
            <div className="flex justify-center -mt-6 mb-2">
              <button 
                onClick={handleVoiceCommand} 
                title="Engage J.A.R.V.I.S Protocol"
                className={`relative w-24 h-24 rounded-full flex items-center justify-center border-2 transition-all duration-500 shadow-2xl ${isListening ? 'border-[#ff0055] bg-[#ff0055]/20 animate-pulse scale-110 shadow-[0_0_50px_rgba(255,0,85,0.6)]' : 'border-[#00f0ff] bg-black/50 hover:bg-[#00f0ff]/10 hover:shadow-[0_0_40px_rgba(0,240,255,0.4)] hover:scale-105'}`}
              >
                {isListening && <div className="absolute inset-0 rounded-full border border-[#ff0055] animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"></div>}
                {isListening && <div className="absolute inset-0 rounded-full border border-[#ff0055] animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] delay-150"></div>}
                
                <svg className={`w-8 h-8 ${isListening ? 'text-[#ff0055]' : 'text-[#00f0ff]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            </div>
            
            <div className="text-center font-mono text-[10px] uppercase text-gray-500 tracking-widest -mt-4 mb-4">
              [ Tap to Engage Audio Intercept ]
            </div>

            <div className="relative">
              <label className="block text-[#00f0ff] text-xs font-bold uppercase tracking-[0.2em] mb-3">Target Identity (Product Name)</label>
              <input 
                type="text" 
                placeholder="e.g. PlayStation 5 Pro" 
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full bg-[#121218]/90 font-mono tracking-widest border-b-2 border-t-0 border-l-0 border-r-0 border-[#00f0ff]/30 px-2 py-4 text-white text-lg placeholder-gray-600 outline-none focus:border-[#00f0ff] focus:ring-0 transition-all shadow-inner"
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-3">Tactical Nodes Selection</label>
              <div className="flex flex-wrap gap-3">
                {availableSources.map(src => (
                  <button 
                    key={src}
                    onClick={() => toggleSource(src)}
                    className={`px-4 py-2 font-mono tracking-widest uppercase border text-xs transition-all ${sources.includes(src) ? 'bg-[#00f0ff]/10 border-[#00f0ff] text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.3)]' : 'bg-black/50 border-gray-800 text-gray-500 hover:text-white hover:border-gray-500'}`}
                  >
                    {src}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-8 relative mt-4">
              <button onClick={handleScrape} disabled={isScraping || isListening} className="w-full h-16 bg-[#ff0055] hover:bg-[#ff0055]/80 text-white font-mono font-black text-lg tracking-[0.3em] uppercase border-0 shadow-[0_0_30px_rgba(255,0,85,0.4)] hover:shadow-[0_0_50px_rgba(255,0,85,0.8)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-pulse">
                {isScraping ? "> SYNCHRONIZING MATRICES..." : "> COMMENCE DEEP INTERCEPT"}
              </button>
            </div>

            {status && (
              <div className="text-center mt-4 p-4 bg-[#0a0a0f] border-l-4 border-r-0 border-y-0 border-[#00f0ff] animate-[fadeIn_0.5s]">
                <span className="text-[#00f0ff] font-mono tracking-widest text-xs uppercase shadow-[0_0_10px_#00f0ff]">{status}</span>
              </div>
            )}
            
            {isPolling && (
              <div className="mt-6 bg-[#050508] border border-[#00f0ff]/20 rounded p-4 h-64 overflow-y-auto font-mono text-xs text-[#00f0ff]/80 text-left shadow-[inset_0_0_30px_rgba(0,240,255,0.05)]">
                {logs.length === 0 ? <p className="animate-pulse">Awaiting neural telemetry streams...</p> : null}
                {logs.map((log, i) => (
                  <div key={i} className="mb-1"><span className="text-gray-600">[{new Date().toISOString().substring(11,19)}] &gt;&gt;</span> <span className="text-white">{log}</span></div>
                ))}
                <div ref={logsEndRef} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default SearchCommandCenter;
