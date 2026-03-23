import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Section from './Section';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setStatus('Please enter credentials.');
      return;
    }
    
    setStatus('Authenticating...');
    try {
      const response = await fetch('http://localhost:2000/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus('Authentication Successful. Initializing...');
        localStorage.setItem('insight_user', JSON.stringify(data.user));
        setTimeout(() => {
          navigate('/dashboard');
          window.location.reload(); // Quick refresh to update Header state
        }, 1000);
      } else {
        setStatus(`Error: ${data.error || 'Authentication Failed'}`);
      }
    } catch (error) {
      setStatus('Network Error: Unable to reach securely.');
    }
  };

  return (
    <Section className="min-h-[80vh] flex items-center justify-center pt-32">
      <div className="w-full max-w-md relative z-1">
        {/* Glow effect behind the card */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 blur-3xl opacity-20 -z-10 rounded-full animate-pulse"></div>
        
        <div className="bg-n-8/60 backdrop-blur-xl border border-n-1/10 rounded-[2.5rem] p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">Welcome Back</h2>
            <p className="text-n-3 text-sm">Initialize secure connection</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div>
              <label className="block text-n-3 text-xs font-bold uppercase tracking-[0.1em] mb-2">Email Identity</label>
              <input 
                type="email" 
                placeholder="agent@insightmantra.ai" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-n-7/50 border border-n-6 rounded-xl px-5 py-4 text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all shadow-inner"
              />
            </div>
            <div>
              <label className="block text-n-3 text-xs font-bold uppercase tracking-[0.1em] mb-2">Security Key</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-n-7/50 border border-n-6 rounded-xl px-5 py-4 text-white outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 transition-all shadow-inner"
              />
            </div>

            {status && (
              <div className="text-center text-cyan-400 font-mono text-sm tracking-wide animate-pulse">{status}</div>
            )}

            <button type="submit" className="w-full h-14 mt-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-extrabold tracking-widest uppercase rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]">
              Authenticate
            </button>
          </form>

          <div className="mt-8 text-center text-n-4 text-sm">
            Don't have clearance? <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">Request Access</Link>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Login;
