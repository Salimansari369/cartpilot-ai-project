import React, { useState } from 'react';
import {
  X,
  Bell,
  CheckCircle2,
  TrendingDown
} from 'lucide-react';
import { Product } from '../types';

interface PriceAlertModalProps {
  product: Product | null;
  onClose: () => void;
  onSetAlert: (productId: number, targetPrice: number, email: string) => void;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  product,
  onClose,
  onSetAlert
}) => {
  if (!product) return null;

  const currentPrice = product.offers?.[0]?.price || 4499;
  const [targetPrice, setTargetPrice] = useState(Math.round(currentPrice * 0.9));
  const [email, setEmail] = useState('shopper@cartpilot.ai');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSetAlert(product.id, targetPrice, email);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0e0f2b] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/30 flex items-center justify-center text-purple-200">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight text-white">
                Set Price Drop Alert
              </h3>
              <p className="text-xs text-purple-200/80 truncate max-w-[240px]">
                {product.canonical_title}
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

        {/* Content */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-black text-slate-900 text-base">Price Alert Set!</h4>
            <p className="text-xs text-slate-500">
              We'll notify you at <strong className="text-slate-800">{email}</strong> the moment {product.canonical_title} drops below ₹{targetPrice.toLocaleString()}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="p-3 bg-purple-50 border border-purple-100 rounded-2xl flex items-center justify-between text-xs">
              <div>
                <p className="text-slate-500">Current Best Price:</p>
                <p className="text-base font-black text-slate-900 mt-0.5">₹{currentPrice.toLocaleString()}</p>
              </div>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-100 px-2 py-1 rounded-lg">
                Amazon / Flipkart
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Target Alert Price (₹)
              </label>
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-purple-400"
                min="500"
                max={currentPrice}
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Trigger when price drops below ~₹{targetPrice.toLocaleString()} ({Math.round(((currentPrice - targetPrice) / currentPrice) * 100)}% extra discount)
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Notification Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#6c47ff] hover:bg-[#5830eb] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
              >
                Activate Alert
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
