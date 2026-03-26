import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { setStatus('Please fill in all fields.'); return; }
    setStatus('Signing in...');
    try {
      const response = await fetch('http://localhost:2000/api/login', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        setStatus('Success! Redirecting...');
        localStorage.setItem('insight_user', JSON.stringify(data.user));
        setTimeout(() => { navigate('/dashboard'); window.location.reload(); }, 1000);
      } else {
        setStatus(`Error: ${data.error || 'Invalid credentials'}`);
      }
    } catch (error) { setStatus('Network error. Please check your connection.'); }
  };

  return (
    <section className="min-h-screen flex items-center justify-center pt-16 bg-gradient-to-br from-surface-50 via-white to-brand-50/30">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <h1 className="text-2xl font-bold text-surface-900">Welcome back</h1>
          <p className="text-surface-500 mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Email</label>
              <input
                type="email" placeholder="you@example.com" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-50 border border-surface-200 rounded-xl px-4 py-3 text-surface-900 placeholder-surface-400 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Password</label>
              <input
                type="password" placeholder="••••••••" value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-50 border border-surface-200 rounded-xl px-4 py-3 text-surface-900 placeholder-surface-400 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
              />
            </div>
            {status && (
              <div className={`text-sm text-center py-2 px-3 rounded-lg ${status.includes('Error') || status.includes('Network') ? 'bg-red-50 text-red-600' : status.includes('Success') ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                {status}
              </div>
            )}
            <button type="submit" className="w-full py-3 bg-surface-900 text-white font-semibold rounded-xl hover:bg-surface-800 transition-colors">
              Sign In
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm text-surface-500">
          Don't have an account? <Link to="/register" className="text-brand-600 font-semibold hover:text-brand-700">Sign Up</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
