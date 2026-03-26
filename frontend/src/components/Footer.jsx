import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-surface-200 bg-white py-8">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs">P</span>
          </div>
          <span className="text-sm font-semibold text-surface-700">PriceScope</span>
        </div>
        <p className="text-sm text-surface-400">
          © {new Date().getFullYear()} PriceScope. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
