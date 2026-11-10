import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  Mic,
  MicOff,
  Search,
  BarChart2,
  Tag,
  User,
  Headphones,
  Laptop,
  Shirt,
  Smartphone,
  ChevronRight,
  Star,
  Zap,
  Sparkles
} from 'lucide-react';
import { useVoiceSearch } from '../hooks/useVoiceSearch';

interface HeroBannerProps {
  onSearchQuery: (query: string) => void;
  isLoading?: boolean;
  searchQuery?: string;
  category?: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onSearchQuery, isLoading, searchQuery, category = 'electronics' }) => {
  const isFashion = category.toLowerCase() === 'fashion';

  const [inputValue, setInputValue] = useState(
    searchQuery || (isFashion
      ? 'Try "Best sneakers under ₹3,000" or "Casual jackets for winter"'
      : 'I want a wireless headphone under ₹5,000 for work and occasional gaming.')
  );

  useEffect(() => {
    if (searchQuery) {
      setInputValue(searchQuery);
    }
  }, [searchQuery]);

  const { isListening, startListening } = useVoiceSearch({
    onResult: (transcript) => {
      setInputValue(transcript);
      onSearchQuery(transcript);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearchQuery(inputValue.trim());
    }
  };

  const isHome = category.toLowerCase() === 'home';
  const isBeauty = category.toLowerCase() === 'beauty';
  const isBooks = category.toLowerCase() === 'books';

  const defaultQuickPrompts = [
    { label: 'Best headphones under ₹5,000', icon: Headphones, query: 'I want a wireless headphone under ₹5,000 for work and occasional gaming.' },
    { label: 'Laptop for coding', icon: Laptop, query: 'Best laptop for coding under ₹70,000 with 16GB RAM and great keyboard.' },
    { label: 'Casual jackets for winter', icon: Shirt, query: 'Casual jackets for winter warm and water repellent under ₹2,000.' },
    { label: 'Phone under ₹20,000', icon: Smartphone, query: 'Best 5G smartphone under ₹20,000 with long battery and AMOLED display.' },
  ];

  const fashionQuickPrompts = [
    { label: "Men's sneakers", icon: Zap, query: 'Best sneakers under ₹3,000 for everyday casual wear.' },
    { label: 'Winter jackets', icon: Shirt, query: 'Warm and lightweight bomber jackets for winter under ₹2,500.' },
    { label: 'Oversized t-shirts', icon: Shirt, query: 'Trending oversized cotton graphic t-shirts under ₹999.' },
    { label: 'Jeans under ₹2,000', icon: Tag, query: 'Best slim fit denim jeans under ₹2,000 from top brands.' },
    { label: 'Backpacks', icon: Sparkles, query: 'Durable stylish laptop backpacks under ₹1,500 for college and travel.' },
  ];

  const homeQuickPrompts = [
    { label: 'Ergonomic chair', icon: Star, query: 'Best ergonomic desk chairs under ₹10,000 with lumbar support.' },
    { label: 'Robot vacuum', icon: Zap, query: 'Smart robotic vacuum and mop under ₹15,000.' },
    { label: 'Digital air fryer', icon: Tag, query: 'Best digital air fryers 4L+ for healthy cooking.' },
    { label: 'Coffee maker', icon: Sparkles, query: 'Automatic espresso and drip coffee machines under ₹8,000.' },
    { label: 'Smart LED lights', icon: Zap, query: 'Smart WiFi RGB ambient desk and room lights under ₹1,500.' },
  ];

  const beautyQuickPrompts = [
    { label: 'Vitamin C serum', icon: Sparkles, query: 'Best Vitamin C serums for glowing skin under ₹800.' },
    { label: 'Multi-trimmer', icon: Zap, query: 'Cordless all-in-one grooming trimmers for men under ₹3,000.' },
    { label: 'Ceramide cleanser', icon: Star, query: 'Gentle hydrating face cleansers for sensitive skin.' },
    { label: 'Mineral sunscreen', icon: Tag, query: 'Matte finish SPF 50 sunscreens leaving zero white cast.' },
  ];

  const booksQuickPrompts = [
    { label: 'Atomic Habits', icon: Star, query: 'Atomic Habits by James Clear paperback edition.' },
    { label: 'Psychology of Money', icon: Tag, query: 'The Psychology of Money by Morgan Housel paperback.' },
    { label: 'Kindle Paperwhite', icon: Zap, query: 'Amazon Kindle Paperwhite glare-free 16GB e-reader.' },
    { label: 'Productivity reads', icon: Sparkles, query: 'Top rated habit and self improvement books.' },
  ];

  const activePrompts = isFashion
    ? fashionQuickPrompts
    : isHome
    ? homeQuickPrompts
    : isBeauty
    ? beautyQuickPrompts
    : isBooks
    ? booksQuickPrompts
    : defaultQuickPrompts;

  return (
    <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-r from-[#f6f5ff] via-[#edf0ff] to-[#f6efff] border border-[#e3e6f8] p-5 sm:p-6 shadow-2xs select-none">
      {/* Top Section: Title & Copy on Left, Authentic 3D Mascot on Right */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left Copy Container */}
        <div className="flex-1 min-w-0 pr-2">
          {/* Category Tag */}
          {isFashion && (
            <div className="mb-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#ede7fe] text-[#6339f8] border border-[#dad0fd]">
                <Shirt className="w-3.5 h-3.5 text-[#6339f8]" />
                <span>Fashion</span>
              </span>
            </div>
          )}
          {isHome && (
            <div className="mb-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span>🛋️</span>
                <span>Home & Living</span>
              </span>
            </div>
          )}
          {isBeauty && (
            <div className="mb-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-pink-50 text-pink-700 border border-pink-200">
                <span>✨</span>
                <span>Beauty & Personal Care</span>
              </span>
            </div>
          )}
          {isBooks && (
            <div className="mb-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
                <span>📚</span>
                <span>Books & More</span>
              </span>
            </div>
          )}

          {/* Main Title */}
          <h1 className="text-[28px] sm:text-[33px] font-extrabold text-[#0f1133] tracking-tight leading-[1.12]">
            {isFashion ? (
              <>
                Find Your Perfect Style <br />
                <span className="text-[#6339f8]">with AI</span> <span className="inline-block text-2xl -translate-y-0.5">✨</span>
              </>
            ) : isHome ? (
              <>
                Upgrade Your Space <br />
                <span className="text-emerald-600">with Smart AI</span> <span className="inline-block text-2xl -translate-y-0.5">🛋️</span>
              </>
            ) : isBeauty ? (
              <>
                Glow with Verified <br />
                <span className="text-pink-600">Care & AI</span> <span className="inline-block text-2xl -translate-y-0.5">✨</span>
              </>
            ) : isBooks ? (
              <>
                Expand Your Mind <br />
                <span className="text-amber-700">with Top Reads</span> <span className="inline-block text-2xl -translate-y-0.5">📚</span>
              </>
            ) : (
              <>
                Meet Your <br />
                <span className="text-[#6339f8]">AI Shopping Agent</span>{' '}
                <span className="inline-block text-2xl -translate-y-0.5">👋</span>
              </>
            )}
          </h1>

          {/* Subtitle description */}
          <p className="mt-2 text-[12.5px] text-[#2e3150] leading-[1.4] font-normal max-w-md">
            {isFashion
              ? 'Discover trending fashion, compare brands, analyze reviews and get AI-powered style recommendations — all in one place.'
              : isHome
              ? 'Find top-rated ergonomic chairs, smart robotic vacuums, and kitchen appliances with verified durability and lowest prices.'
              : isBeauty
              ? 'Explore dermatologist-tested skincare serums, precision multi-trimmers, and barrier-safe personal care across verified stores.'
              : isBooks
              ? 'Discover life-changing non-fiction paperbacks, finance classics, and Kindle devices at all-time lowest Amazon & Flipkart prices.'
              : "Describe what you need, and I'll search across Amazon, Flipkart, Meesho and Myntra, compare options, analyze reviews, and recommend the best buy."}
          </p>

          {/* 4 Feature Pills in a single neat row */}
          <div className="mt-3.5 flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white text-[#11132d] border border-[#e2e5f8] shadow-2xs whitespace-nowrap">
              <Tag className="w-3 h-3 text-[#6339f8] stroke-[2.5]" />
              <span>Compare Prices</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white text-[#11132d] border border-[#e2e5f8] shadow-2xs whitespace-nowrap">
              <Star className="w-3 h-3 text-[#6339f8] stroke-[2.5]" />
              <span>{isFashion ? 'Style Match' : isHome ? 'Room Fit' : isBeauty ? 'Skin Match' : 'Top Rated'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white text-[#11132d] border border-[#e2e5f8] shadow-2xs whitespace-nowrap">
              <Tag className="w-3 h-3 text-[#6339f8] stroke-[2.5]" />
              <span>Best Offers</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white text-[#11132d] border border-[#e2e5f8] shadow-2xs whitespace-nowrap">
              <User className="w-3 h-3 text-[#6339f8] stroke-[2.5]" />
              <span>Personalized Picks</span>
            </span>
          </div>
        </div>

        {/* Right Side: Authentic 3D Robot Mascot Graphic */}
        <div className="relative w-64 h-36 sm:w-72 sm:h-40 flex-shrink-0 flex items-center justify-center">
          <img
            src={isFashion ? "/mascot_fashion.png" : "/mascot_feathered.png?v=3"}
            alt="AI Shopping Agent Mascot"
            className="w-full h-full object-contain pointer-events-none select-none drop-shadow-sm"
          />
        </div>
      </div>

      {/* Natural Language Prompt Search Bar */}
      <div className="mt-4">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <div className="w-full relative flex items-center bg-white rounded-full border border-[#dedafe] shadow-xs py-1 px-3 focus-within:ring-2 focus-within:ring-[#6339f8]">
            {/* Sparkle icon on left */}
            <div className="pr-2.5 text-[#6339f8] flex-shrink-0">
              <svg className="w-4 h-4 fill-[#6339f8]" viewBox="0 0 24 24">
                <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />
              </svg>
            </div>

            {/* Input field */}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                isListening
                  ? '🎙️ Listening... Speak your shopping request now...'
                  : isFashion
                  ? 'Try "Best sneakers under ₹3,000" or "Casual jackets for winter"'
                  : 'I want a wireless headphone under ₹5,000 for work and occasional gaming.'
              }
              className={`w-full bg-transparent py-2 text-[13px] font-medium outline-none ${
                isListening ? 'text-purple-700 animate-pulse placeholder:text-purple-600 font-bold' : 'text-[#0f1130] placeholder:text-[#555877]'
              }`}
            />

            {/* Right Action buttons */}
            <div className="flex items-center gap-2 pl-2 flex-shrink-0">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#6339f8] hover:bg-[#5229eb] text-white rounded-full text-xs font-bold transition-all shadow-xs"
              >
                <span>{isLoading ? 'Searching...' : 'Find for Me'}</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              <button
                type="button"
                className={`p-2 rounded-full transition-all flex items-center justify-center ${
                  isListening
                    ? 'bg-red-500 text-white animate-bounce shadow-md shadow-red-500/30'
                    : 'text-[#3b3e5b] hover:text-[#6339f8] hover:bg-purple-50'
                }`}
                title={isListening ? 'Listening... click to stop' : 'Click to Speak (Voice Search)'}
                onClick={startListening}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  <Mic className="w-4 h-4 stroke-[2]" />
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Quick Prompts Row without scrollbars */}
      <div className="mt-3 flex items-center gap-2 overflow-x-hidden">
        <span className="text-[11.5px] font-extrabold text-[#0e1030] whitespace-nowrap">
          {isFashion ? 'Quick Searches:' : 'Quick Prompts:'}
        </span>
        <div className="flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {activePrompts.map((qp, idx) => {
            const Icon = qp.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputValue(qp.query);
                  onSearchQuery(qp.query);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white hover:bg-slate-50 text-[#1a1c36] border border-[#e2e5fa] shadow-2xs transition-all whitespace-nowrap"
              >
                <Icon className="w-3 h-3 text-[#6339f8]" />
                <span>{qp.label}</span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => {
            const nextQuery = activePrompts[1].query;
            setInputValue(nextQuery);
            onSearchQuery(nextQuery);
          }}
          className="p-1 rounded-full bg-white hover:bg-slate-50 text-[#1a1c36] border border-[#e2e5fa] shadow-2xs flex-shrink-0"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
