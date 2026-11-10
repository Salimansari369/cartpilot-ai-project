import React, { useState } from 'react';
import { PiggyBank, Sparkles, TrendingDown } from 'lucide-react';
import { Product } from '../types';

interface CompareAndSaveCardProps {
  product?: Product;
}

export const CompareAndSaveCard: React.FC<CompareAndSaveCardProps> = ({ product }) => {
  const [showFestivePrediction, setShowFestivePrediction] = useState(false);

  const offers = product?.offers || [
    { platform: 'amazon', price: 2999 },
    { platform: 'flipkart', price: 3039 },
    { platform: 'myntra', price: 2999 }
  ];

  const minPrice = Math.min(...offers.map((o) => o.price));
  const maxPrice = 4495; // Original MRP
  const savings = maxPrice - minPrice;
  const savingsPct = Math.round((savings / maxPrice) * 100);

  // Festive drop simulation
  const festivePredictedPrice = Math.round(minPrice * 0.84); // 16% extra festive discount
  const extraSavings = minPrice - festivePredictedPrice;

  return (
    <div className="bg-white rounded-[26px] border border-[#e5e8f5] p-5 shadow-xs flex flex-col justify-between select-none">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-[#11132d] text-base leading-tight">
              Compare & Save
            </h3>
            <p className="text-xs text-[#787b99] mt-0.5 font-medium">
              Same product across platforms
            </p>
          </div>
          <button
            onClick={() => setShowFestivePrediction(!showFestivePrediction)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border transition-all flex items-center gap-1 ${
              showFestivePrediction
                ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-2xs'
                : 'bg-purple-50 border-purple-200 text-[#6339f8] hover:bg-purple-100'
            }`}
            title="Toggle Festive Price Prediction"
          >
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>{showFestivePrediction ? 'Festive Mode On' : 'Predict Festive Sale'}</span>
          </button>
        </div>

        {/* Festive Mode Alert if active */}
        {showFestivePrediction ? (
          <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-purple-500/5 border border-amber-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-amber-900 uppercase tracking-wide flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5 text-amber-700" /> Great Indian Festival Forecast
              </span>
              <span className="text-[10px] font-black bg-amber-500 text-white px-2 py-0.5 rounded-md">
                86% Confidence
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-[#11132d]">
                ₹{festivePredictedPrice.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-emerald-700">
                (Extra ₹{extraSavings.toLocaleString()} drop expected)
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Historical pricing reveals Amazon & Flipkart drop footwear by an additional 14-18% during major festive sales with bank offers.
            </p>
          </div>
        ) : (
          /* Platform Comparison List */
          <div className="mt-5 space-y-3.5">
            {/* 1. Amazon */}
            <div className="flex items-center justify-between py-1.5 border-b border-[#f3f4fa]">
              <div className="flex items-center gap-2.5">
                <span className="font-black text-base text-black tracking-tighter">a</span>
                <span className="text-xs font-bold text-[#1a1c36]">Amazon</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-[#11132d]">
                  ₹2,999
                </span>
              </div>
            </div>

            {/* 2. Flipkart */}
            <div className="flex items-center justify-between py-1.5 border-b border-[#f3f4fa]">
              <div className="flex items-center gap-2.5">
                <span className="font-black text-sm text-[#2874f0] italic">f</span>
                <span className="text-xs font-bold text-[#1a1c36]">Flipkart</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-[#11132d]">
                  ₹3,039
                </span>
              </div>
            </div>

            {/* 3. Myntra */}
            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2.5">
                <span className="font-black text-xs bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">M</span>
                <span className="text-xs font-bold text-[#1a1c36]">Myntra</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-[#11132d]">
                  ₹2,999
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#6339f8] text-white text-[10px] font-extrabold">
                  Best Deal
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Savings Callout in Soft Green */}
      <div className="mt-5 p-3 rounded-2xl bg-[#ebfbf2] border border-[#c6f1d9] flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-[#16a34a] shadow-2xs">
          <PiggyBank className="w-4 h-4 stroke-[2.5]" />
        </div>
        <p className="text-[11.5px] font-bold text-[#166534] leading-snug">
          You save ₹{savings.toLocaleString()} ({savingsPct}%) <span className="font-medium text-[#15803d]">compared to the highest price.</span>
        </p>
      </div>
    </div>
  );
};
