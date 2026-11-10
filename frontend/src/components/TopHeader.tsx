import React, { useState } from 'react';
import { Search, Sparkles, Scale, Bell, ShoppingCart } from 'lucide-react';

interface TopHeaderProps {
  onSearch: (query: string) => void;
  onOpenCompare: () => void;
  onOpenAlerts: () => void;
  onOpenCart: () => void;
  onOpenPreferences: () => void;
  cartCount: number;
  category?: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onSearch,
  onOpenCompare,
  onOpenAlerts,
  onOpenCart,
  onOpenPreferences,
  cartCount,
  category = 'electronics'
}) => {
  const [searchInput, setSearchInput] = useState('');
  const isFashion = category.toLowerCase() === 'fashion';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  return (
    <header className="bg-[#0a0b24] text-white px-5 lg:px-7 py-3 sticky top-0 z-40 shadow-sm border-b border-[#181938]">
      <div className="max-w-[1740px] mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none flex-shrink-0" 
          onClick={() => window.location.reload()}
        >
          <div className="w-10 h-10 rounded-2xl bg-[#6339f8] flex items-center justify-center shadow-lg shadow-purple-600/30">
            {/* Shopping Bag Icon */}
            <svg 
              className="w-5 h-5 text-white" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1 leading-none">
              <span className="font-extrabold text-[22px] tracking-tight text-white font-sans">CartPilot</span>
              <span className="font-extrabold text-[22px] text-[#b465ff] tracking-tight">AI</span>
            </div>
            <p className="text-[11px] text-[#9395c4] font-medium tracking-normal mt-1">
              Agentic Shopping Assistant
            </p>
          </div>
        </div>

        {/* Center Search Bar */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-2xl mx-4 hidden md:block">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={isFashion ? 'Search for products, brands or ask CartPilot... e.g., "Best sneakers under ₹3,000"' : 'Search anything or ask CartPilot...  e.g. "Best laptop for coding under ₹70,000"'}
              className="w-full bg-white text-[#1a1b3d] text-[13px] pl-5 pr-14 py-2.5 rounded-full outline-none placeholder:text-[#9497b8] placeholder:text-[13px] shadow-sm font-medium"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-3 py-1.5 bg-[#6339f8] hover:bg-[#5229eb] text-white rounded-full transition-all flex items-center justify-center"
              title="Search"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </form>

        {/* Right Header Navigation Icons */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          {/* Ask AI Pill Button */}
          <button
            onClick={onOpenPreferences}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#1d1547] text-[#e0b7ff] border border-[#482885] hover:bg-[#281b66] transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d58aff]" />
            <span>Ask AI</span>
          </button>

          {/* Compare */}
          <button
            onClick={onOpenCompare}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-[#cfd1ee] hover:text-white transition-colors"
          >
            <Scale className="w-4 h-4 text-[#9c9fcb]" />
            <span className="hidden sm:inline">Compare</span>
          </button>

          {/* Price Alerts */}
          <button
            onClick={onOpenAlerts}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-[#cfd1ee] hover:text-white transition-colors"
          >
            <Bell className="w-4 h-4 text-[#9c9fcb]" />
            <span className="hidden sm:inline">Price Alerts</span>
          </button>

          {/* Cart with Pinkish Badge */}
          <button
            onClick={onOpenCart}
            className="relative p-2 text-white hover:text-purple-200 transition-colors ml-1"
            title="Cart"
          >
            <ShoppingCart className="w-5 h-5 text-white" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#c822e0] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md">
              {cartCount}
            </span>
          </button>

          {/* User Profile Avatar S */}
          <div className="w-8 h-8 rounded-full bg-[#3b2b73] border border-[#5841a3] flex items-center justify-center text-xs font-extrabold text-[#f1eaff] ml-1 select-none">
            S
          </div>
        </div>
      </div>
    </header>
  );
};
