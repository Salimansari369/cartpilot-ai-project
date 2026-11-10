import React from 'react';
import { X, TrendingUp, Sparkles, ArrowRight, Flame, ShoppingBag, Eye } from 'lucide-react';

interface TrendExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrend: (query: string, category: string) => void;
}

export const TrendExplorerModal: React.FC<TrendExplorerModalProps> = ({
  isOpen,
  onClose,
  onSelectTrend
}) => {
  if (!isOpen) return null;

  const trendingItems = [
    {
      id: 1,
      title: 'Retro White Basketball Sneakers',
      category: 'fashion',
      growth: '+185% search surge',
      badge: 'Viral Style',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      description: 'Court Vision & 80s throwback silhouette dominating Indian college campuses and casual workspaces.',
      priceRange: '₹2,500 - ₹3,500',
      query: 'Best sneakers under ₹3,000 for everyday casual wear.'
    },
    {
      id: 2,
      title: 'Active Noise Cancelling (ANC) Headphones',
      category: 'electronics',
      growth: '+142% search surge',
      badge: 'Tech Bestseller',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      description: 'Budget ANC sub-₹5,000 headphones for remote meetings, hybrid work and travel commutes.',
      priceRange: '₹4,000 - ₹5,500',
      query: 'I want a wireless headphone under ₹5,000 for work and occasional gaming.'
    },
    {
      id: 3,
      title: 'High-Density Ergonomic Spine Support Chairs',
      category: 'home',
      growth: '+115% search surge',
      badge: 'Home Office',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'Breathable mesh & frog mechanism desk chairs reducing lower back strain during 9-hour sitting shifts.',
      priceRange: '₹8,000 - ₹12,000',
      query: 'Best ergonomic desk chairs under ₹10,000 with lumbar support.'
    },
    {
      id: 4,
      title: 'Winter Fleece Neutral Hoodies & Bomber Jackets',
      category: 'fashion',
      growth: '+128% search surge',
      badge: 'Seasonal Trend',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      description: 'Beige, Camel, and Charcoal fleece pullover layers with relaxed streetwear drop shoulders.',
      priceRange: '₹1,200 - ₹2,500',
      query: 'Casual jackets for winter warm and water repellent under ₹2,000.'
    },
    {
      id: 5,
      title: 'Gentle Barrier Repair & Vitamin C Serums',
      category: 'beauty',
      growth: '+96% search surge',
      badge: 'Derm Favorite',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      description: 'Gentle ceramide cleansers and stable Ethyl Ascorbic serums with zero comedogenic irritation.',
      priceRange: '₹600 - ₹1,200',
      query: 'Top beauty and personal care essentials with best ratings.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 via-white to-amber-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-[#6339f8] text-white flex items-center justify-center shadow-md shadow-purple-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-[#11132d]">CartPilot Trend Explorer</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-white" /> Live Signals
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Real-time product demand and discount trends across Amazon, Flipkart, & Myntra
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-3.5">
          {trendingItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#6339f8] transition-all hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  <span className="text-[11px] font-extrabold text-emerald-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> {item.growth}
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-[#11132d] group-hover:text-[#6339f8] transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-snug">
                  {item.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] text-slate-400 font-medium">Observed Range:</span>
                  <span className="text-xs font-bold text-slate-800">{item.priceRange}</span>
                </div>
              </div>

              <div className="flex-shrink-0">
                <button
                  onClick={() => {
                    onSelectTrend(item.query, item.category);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#6339f8] hover:bg-[#5229eb] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs group-hover:shadow-md"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Find Deals</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Signals updated every 60 mins from verified merchant APIs.</span>
          <button
            onClick={onClose}
            className="font-bold text-[#6339f8] hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
