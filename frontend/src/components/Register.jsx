import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Section from './Section';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setStatus('Please complete all identification fields.');
      return;
    }
    
    setStatus('Establishing node link...');
    try {
      const response = await fetch('http://localhost:2000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus('Identity generated. Please authenticate.');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setStatus(`Error: ${data.error || 'Registration Failed'}`);
      }
    } catch (error) {
      setStatus('Network Error: Overload or unavailable.');
    }
  };

  return (
    <Section className="min-h-[80vh] flex items-center justify-center pt-32">
      <div className="w-full max-w-md relative z-1">
        {/* Glow effect behind the card */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 blur-3xl opacity-20 -z-10 rounded-full animate-pulse"></div>
        
        <div className="bg-n-8/60 backdrop-blur-xl border border-n-1/10 rounded-[2.5rem] p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">Initialize Access</h2>
            <p className="text-n-3 text-sm">Create your command identity</p>
          </div>

          <form onSubmit={handleRegister} className="flex flex-col gap-6">
            <div>
              <label className="block text-n-3 text-xs font-bold uppercase tracking-[0.1em] mb-2">Agent Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-n-7/50 border border-n-6 rounded-xl px-5 py-4 text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all shadow-inner"
              />
            </div>
            <div>
              <label className="block text-n-3 text-xs font-bold uppercase tracking-[0.1em] mb-2">New Email Identity</label>
              <input 
                type="email" 
                placeholder="agent@insightmantra.ai" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-n-7/50 border border-n-6 rounded-xl px-5 py-4 text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all shadow-inner"
              />
            </div>
            <div>
              <label className="block text-n-3 text-xs font-bold uppercase tracking-[0.1em] mb-2">Encryption Key (Password)</label>
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

            <button type="submit" className="w-full h-14 mt-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-extrabold tracking-widest uppercase rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]">
              Establish Link
            </button>
          </form>

          <div className="mt-8 text-center text-n-4 text-sm">
            Already verified? <Link to="/login" className="text-purple-400 hover:text-purple-300 font-bold transition-colors">Authenticate</Link>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Register;
