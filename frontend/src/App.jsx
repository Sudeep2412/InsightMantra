import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Benefits from "./components/Benefits";
import PredictiveDashboard from "./components/PredictiveDashboard";
import DataUploader from "./components/DataUploader";
import MarketAnalysis from "./components/MarketAnalysis";
import SearchCommandCenter from "./components/SearchCommandCenter";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Login from "./components/Login";
import Register from "./components/Register";
import ErrorBoundary from "./components/ErrorBoundary";

const PageLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-surface-50">
    <Header />
    <div className="flex-grow">{children}</div>
    <Footer />
  </div>
);

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('insight_user');
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const LandingPage = () => (<PageLayout><Hero /><Benefits /></PageLayout>);
const DashboardPage = ({ dashboardKey }) => (<PageLayout><PredictiveDashboard key={`dash-${dashboardKey}`} /><MarketAnalysis key={`market-${dashboardKey}`} /></PageLayout>);
const InterceptPage = () => (<PageLayout><SearchCommandCenter /></PageLayout>);
const DataFusionPage = ({ onUploadSuccess }) => (<PageLayout><DataUploader onUploadSuccess={onUploadSuccess} /></PageLayout>);

const App = () => {
  const [dashboardKey, setDashboardKey] = useState(0);
  const handleUploadSuccess = () => setDashboardKey(prev => prev + 1);

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PageLayout><Login /></PageLayout>} />
        <Route path="/register" element={<PageLayout><Register /></PageLayout>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage dashboardKey={dashboardKey} /></ProtectedRoute>} />
        <Route path="/intercept" element={<ProtectedRoute><InterceptPage /></ProtectedRoute>} />
        <Route path="/data-fusion" element={<ProtectedRoute><DataFusionPage onUploadSuccess={handleUploadSuccess} /></ProtectedRoute>} />
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
