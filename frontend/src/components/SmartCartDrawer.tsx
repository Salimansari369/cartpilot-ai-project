import React from 'react';
import {
  X,
  ShoppingCart,
  Trash2,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  Share2
} from 'lucide-react';
import { Product } from '../types';

interface SmartCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartProducts: Product[];
  onRemoveItem: (productId: number) => void;
}

export const SmartCartDrawer: React.FC<SmartCartDrawerProps> = ({
  isOpen,
  onClose,
  cartProducts,
  onRemoveItem
}) => {
  if (!isOpen) return null;

  const totalCost = cartProducts.reduce((sum, p) => {
    const minOffer = p.offers?.[0]?.price || 3999;
    return sum + minOffer;
  }, 0);

  const totalSaved = cartProducts.reduce((sum, p) => {
    const o = p.offers?.[0];
    if (o && o.original_price > o.price) {
      return sum + (o.original_price - o.price);
    }
    return sum + 1500;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-5 bg-[#0e0f2b] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/30 flex items-center justify-center text-purple-200">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-base tracking-tight text-white">
                  Smart Cart Shortlist
                </h3>
                <p className="text-xs text-purple-200/80">
                  {cartProducts.length} items optimized for lowest total cost
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-purple-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {cartProducts.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <ShoppingCart className="w-10 h-10 mx-auto stroke-1 mb-2 opacity-50" />
                <p className="text-sm font-semibold">Your Smart Cart is empty</p>
                <p className="text-xs mt-1">Add items from recommendations to compare checkout options.</p>
              </div>
            ) : (
              cartProducts.map((p) => {
                const bestOffer = p.offers?.[0] || {
                  platform: 'amazon',
                  price: 4499,
                  original_price: 6999,
                  url: 'https://www.amazon.in'
                };

                return (
                  <div
                    key={p.id}
                    className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-3 relative group"
                  >
                    <div className="w-16 h-16 bg-white rounded-xl p-1 border border-slate-100 flex items-center justify-center flex-shrink-0">
                      <img
                        src={p.thumbnail_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'}
                        alt={p.canonical_title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0 text-xs">
                      <h4 className="font-bold text-slate-900 truncate">{p.canonical_title}</h4>
                      <p className="text-[11px] text-slate-500 capitalize">
                        Best on <strong className="text-purple-700">{bestOffer.platform}</strong>
                      </p>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="font-black text-slate-900 text-sm">
                          ₹{bestOffer.price?.toLocaleString()}
                        </span>
                        {bestOffer.original_price > bestOffer.price && (
                          <span className="text-[10px] text-slate-400 line-through">
                            ₹{bestOffer.original_price?.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => onRemoveItem(p.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Remove from shortlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <a
                        href={bestOffer.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 rounded-lg bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 text-[10px] font-bold flex items-center gap-1 shadow-2xs"
                      >
                        <span>Store</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer & Direct Merchant Checkout Links */}
          {cartProducts.length > 0 && (
            <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Total Combined Estimated Cost:</span>
                <span className="text-base font-black text-slate-900">₹{totalCost.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-emerald-600 font-bold">
                <span>Total Savings Across Stores:</span>
                <span>₹{totalSaved.toLocaleString()} Saved</span>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-100/60 text-purple-900 text-[11px] font-medium leading-tight">
                🔒 CartPilot AI does not process credit cards directly. Each checkout link below opens the merchant's official secure portal.
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    const lines = cartProducts.map((p) => {
                      const off = p.offers?.[0];
                      return `• ${p.canonical_title} - ₹${(off?.price || 0).toLocaleString()} on ${(off?.platform || 'Store').toUpperCase()}`;
                    }).join('\n');
                    const text = encodeURIComponent(
                      `🛍️ *My CartPilot AI Smart Cart*\n\n` +
                      lines +
                      `\n\n*Total:* ₹${totalCost.toLocaleString()} (Saved ₹${totalSaved.toLocaleString()})\n` +
                      `Check deals on CartPilot: http://localhost:5173/`
                    );
                    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Cart on WhatsApp</span>
                </button>

                <a
                  href={cartProducts[0]?.offers?.[0]?.url || 'https://www.amazon.in'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#6c47ff] hover:bg-[#5830eb] text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  <span>Proceed to Merchant Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
