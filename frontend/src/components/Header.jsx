import { useLocation, Link } from "react-router-dom";
import { navigation } from "../constants";
import { useState } from "react";

const Header = () => {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const userStr = localStorage.getItem('insight_user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('insight_user');
    window.location.reload();
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-surface-200">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="text-xl font-bold text-surface-900">PriceScope</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navigation.map((item) => (
            <Link
              key={item.id}
              to={item.url}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                item.url === pathname
                  ? "text-brand-600 bg-brand-50"
                  : "text-surface-600 hover:text-surface-900 hover:bg-surface-100"
              }`}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm font-medium text-surface-700">{user.name}</span>
              <button onClick={handleLogout} className="text-sm text-surface-500 hover:text-red-500 transition-colors">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="text-sm font-medium text-surface-600 hover:text-surface-900 transition-colors">
                Sign Up
              </Link>
              <Link
                to="/login"
                className="text-sm font-semibold px-5 py-2.5 bg-surface-900 text-white rounded-lg hover:bg-surface-800 transition-colors"
              >
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-surface-100">
          <svg className="w-5 h-5 text-surface-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-surface-200 px-6 py-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.id}
              to={item.url}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                item.url === pathname
                  ? "text-brand-600 bg-brand-50"
                  : "text-surface-600 hover:bg-surface-100"
              }`}
            >
              {item.title}
            </Link>
          ))}
          <div className="pt-3 border-t border-surface-200 flex gap-3">
            {user ? (
              <button onClick={handleLogout} className="text-sm text-red-500">Logout</button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm font-semibold px-5 py-2.5 bg-surface-900 text-white rounded-lg w-full text-center">Sign In</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
