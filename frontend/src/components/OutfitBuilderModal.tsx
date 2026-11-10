import React, { useState } from 'react';
import { X, Sparkles, Check, ShoppingCart, Share2, Tag, Shirt, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface OutfitBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseProduct?: Product | null;
  onAddToCart: (prodId: number) => void;
  onAddMultipleToCart?: (prodIds: number[]) => void;
}

interface OutfitPiece {
  id: number;
  category: string;
  name: string;
  brand: string;
  platform: 'amazon' | 'flipkart' | 'myntra';
  price: number;
  originalPrice: number;
  imageUrl: string;
  matchReason: string;
}

export const OutfitBuilderModal: React.FC<OutfitBuilderModalProps> = ({
  isOpen,
  onClose,
  baseProduct,
  onAddToCart,
  onAddMultipleToCart
}) => {
  const [selectedStyle, setSelectedStyle] = useState<'streetwear' | 'smart_casual' | 'weekend'>('streetwear');
  const [addedAll, setAddedAll] = useState(false);

  if (!isOpen) return null;

  const outfitBundles: Record<string, { title: string; desc: string; items: OutfitPiece[] }> = {
    streetwear: {
      title: 'Urban Streetwear Look',
      desc: 'High-contrast monochrome street style perfect for college, meetups, and travel.',
      items: [
        {
          id: 201,
          category: 'Footwear',
          name: 'Nike Court Vision Low (White/Black)',
          brand: 'Nike',
          platform: 'amazon',
          price: 2999,
          originalPrice: 4495,
          imageUrl: '/fashion_nike_sneaker.png',
          matchReason: 'Anchors the clean monochrome silhouette'
        },
        {
          id: 202,
          category: 'Outerwear',
          name: 'Roadster Solid Pitch Black Bomber Jacket',
          brand: 'Roadster',
          platform: 'flipkart',
          price: 1899,
          originalPrice: 2999,
          imageUrl: '/fashion_roadster_jacket.png',
          matchReason: 'Adds edgy layer with wind resistance'
        },
        {
          id: 205,
          category: 'Pants',
          name: 'Highlander Slim-Tapered Washed Indigo Denim',
          brand: 'Highlander',
          platform: 'myntra',
          price: 1199,
          originalPrice: 2499,
          imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80',
          matchReason: 'Complements low-cut sneaker collar'
        }
      ]
    },
    smart_casual: {
      title: 'Minimalist Smart Casual',
      desc: 'Clean relaxed everyday styling suitable for casual workdays and coffee runs.',
      items: [
        {
          id: 203,
          category: 'Topwear',
          name: 'H&M Casual Pullover Hoodie (Beige / Camel)',
          brand: 'H&M',
          platform: 'myntra',
          price: 1299,
          originalPrice: 1999,
          imageUrl: '/fashion_hm_hoodie.png',
          matchReason: 'Neutral earth tone matches white sneakers effortlessly'
        },
        {
          id: 201,
          category: 'Footwear',
          name: 'Nike Court Vision Low',
          brand: 'Nike',
          platform: 'amazon',
          price: 2999,
          originalPrice: 4495,
          imageUrl: '/fashion_nike_sneaker.png',
          matchReason: 'Elevates casual hoodie with crisp leather footwear'
        },
        {
          id: 206,
          category: 'Bottoms',
          name: 'Mast & Harbour Olive Chino Trousers',
          brand: 'Mast & Harbour',
          platform: 'flipkart',
          price: 999,
          originalPrice: 1999,
          imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80',
          matchReason: 'Soft stretch fabric balanced with beige tones'
        }
      ]
    },
    weekend: {
      title: 'Weekend Comfort Vibe',
      desc: 'Ultra-comfortable weekend layering with hoodie, jacket, and sneakers.',
      items: [
        {
          id: 202,
          category: 'Jacket',
          name: 'Roadster Bomber Jacket',
          brand: 'Roadster',
          platform: 'flipkart',
          price: 1899,
          originalPrice: 2999,
          imageUrl: '/fashion_roadster_jacket.png',
          matchReason: 'Lightweight shell over relaxed hoodie'
        },
        {
          id: 203,
          category: 'Hoodie',
          name: 'H&M Casual Fleece Hoodie',
          brand: 'H&M',
          platform: 'myntra',
          price: 1299,
          originalPrice: 1999,
          imageUrl: '/fashion_hm_hoodie.png',
          matchReason: 'Warm layer with snug collar fit'
        },
        {
          id: 201,
          category: 'Shoes',
          name: 'Nike Court Vision Low',
          brand: 'Nike',
          platform: 'amazon',
          price: 2999,
          originalPrice: 4495,
          imageUrl: '/fashion_nike_sneaker.png',
          matchReason: 'All-day walking comfort rubber sole'
        }
      ]
    }
  };

  const currentBundle = outfitBundles[selectedStyle];
  const totalPrice = currentBundle.items.reduce((sum, item) => sum + item.price, 0);
  const totalOriginal = currentBundle.items.reduce((sum, item) => sum + item.originalPrice, 0);
  const totalSavings = totalOriginal - totalPrice;
  const savingsPct = Math.round((totalSavings / totalOriginal) * 100);

  const handleAddAll = () => {
    if (onAddMultipleToCart) {
      onAddMultipleToCart(currentBundle.items.map((i) => i.id));
    } else {
      currentBundle.items.forEach((i) => onAddToCart(i.id));
    }
    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Check out this AI-styled outfit from CartPilot AI!\n\n` +
      `Look: ${currentBundle.title}\n` +
      currentBundle.items.map((i) => `• ${i.name} - ₹${i.price.toLocaleString()} (${i.platform.toUpperCase()})`).join('\n') +
      `\n\nTotal: ₹${totalPrice.toLocaleString()} (Saved ₹${totalSavings.toLocaleString()}, ${savingsPct}% OFF!)\n` +
      `View on CartPilot AI: http://localhost:5173/`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 via-white to-pink-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6339f8] to-[#9a67ea] text-white flex items-center justify-center shadow-md shadow-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-[#11132d]">AI Style Assistant & Outfit Builder</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#6339f8] text-white">
                  Multi-Store Match
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                AI creates verified coordinated looks across Amazon, Flipkart, and Myntra
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

        {/* Style Selector Pills */}
        <div className="px-6 pt-4 pb-2 flex items-center gap-2 border-b border-slate-100 bg-slate-50/50">
          <span className="text-xs font-bold text-slate-600 mr-2 flex items-center gap-1">
            <Shirt className="w-3.5 h-3.5 text-[#6339f8]" /> Vibe:
          </span>
          {(['streetwear', 'smart_casual', 'weekend'] as const).map((style) => (
            <button
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                selectedStyle === style
                  ? 'bg-[#6339f8] text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {style === 'streetwear' && '⚡ Urban Streetwear'}
              {style === 'smart_casual' && '👔 Smart Casual'}
              {style === 'weekend' && '☕ Weekend Comfort'}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Active Look Summary Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/5 to-indigo-500/5 border border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-[#11132d]">{currentBundle.title}</h3>
              <p className="text-xs text-slate-600 mt-0.5">{currentBundle.desc}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#ebfbf2] text-[#166534] border border-[#c6f1d9] flex items-center gap-1">
                <Tag className="w-3 h-3" /> Save ₹{totalSavings.toLocaleString()} ({savingsPct}%)
              </span>
            </div>
          </div>

          {/* Outfit Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentBundle.items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-purple-300 p-3.5 flex flex-col justify-between shadow-xs transition-all hover:shadow-md"
              >
                <div>
                  {/* Category and platform badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 capitalize">
                      {item.platform}
                    </span>
                  </div>

                  {/* Thumbnail */}
                  <div className="w-full h-32 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden mb-3 p-2">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-contain mix-blend-multiply transition-transform hover:scale-105 duration-300"
                    />
                  </div>

                  {/* Product Title */}
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight">
                    {item.name}
                  </h4>

                  {/* AI Match Reason */}
                  <p className="text-[11px] text-purple-700 bg-purple-50 px-2 py-1 rounded-lg mt-2 font-medium leading-snug">
                    ✨ {item.matchReason}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-extrabold text-[#11132d]">
                        ₹{item.price.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 line-through">
                        ₹{item.originalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onAddToCart(item.id)}
                    className="p-1.5 bg-[#f0ecfe] hover:bg-[#6339f8] text-[#6339f8] hover:text-white rounded-lg transition-colors"
                    title="Add piece to cart"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Summary & Action Bar */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-[11px] text-slate-500 font-medium">Bundle Total (3 Items):</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-[#11132d]">
                  ₹{totalPrice.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 line-through">
                  ₹{totalOriginal.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-green-600">
                  Save ₹{totalSavings.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Share to WhatsApp */}
            <button
              onClick={handleShareWhatsApp}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 bg-white text-slate-700 hover:text-emerald-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              title="Share look on WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Share Look</span>
            </button>

            {/* Add All to Cart */}
            <button
              onClick={handleAddAll}
              disabled={addedAll}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                addedAll
                  ? 'bg-emerald-600 shadow-emerald-500/20'
                  : 'bg-[#6339f8] hover:bg-[#5229eb] shadow-purple-600/30'
              }`}
            >
              {addedAll ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added 3 Items to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add Complete Look to Cart</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
