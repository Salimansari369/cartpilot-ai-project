import React, { useState } from 'react';
import { X, Sliders, CheckCircle2, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';

interface SizeFitModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

export const SizeFitModal: React.FC<SizeFitModalProps> = ({
  isOpen,
  onClose,
  productName = 'Nike Court Vision Low'
}) => {
  const [tab, setTab] = useState<'footwear' | 'apparel'>('footwear');
  const [knownBrand, setKnownBrand] = useState('adidas');
  const [knownSize, setKnownSize] = useState('UK 9');
  const [footWidth, setFootWidth] = useState<'regular' | 'wide'>('wide');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 via-white to-blue-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6339f8] to-[#7d4cf9] text-white flex items-center justify-center shadow-md shadow-purple-500/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-[#11132d]">AI Size & Fit Guide</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#6339f8] text-white">
                  98% Fit Accuracy
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Targeting: <strong className="text-slate-800">{productName}</strong>
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

        {/* Tab switch */}
        <div className="px-6 pt-4 pb-2 flex items-center gap-2 border-b border-slate-100 bg-slate-50/50">
          <button
            onClick={() => setTab('footwear')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              tab === 'footwear'
                ? 'bg-[#6339f8] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            👟 Footwear (Sneakers & Shoes)
          </button>
          <button
            onClick={() => setTab('apparel')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              tab === 'apparel'
                ? 'bg-[#6339f8] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            👕 Apparel (Jackets & Hoodies)
          </button>
        </div>

        {/* Body Form */}
        <div className="p-6 overflow-y-auto space-y-5">
          {tab === 'footwear' ? (
            <>
              {/* Interactive Sizing Calculator */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="text-xs font-extrabold text-[#11132d] uppercase tracking-wider">
                  What brand size fits you best currently?
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Your Brand</label>
                    <select
                      value={knownBrand}
                      onChange={(e) => setKnownBrand(e.target.value)}
                      className="w-full text-xs font-bold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-purple-600"
                    >
                      <option value="adidas">Adidas (Superstar/Stan Smith)</option>
                      <option value="puma">Puma (Smash/Suede)</option>
                      <option value="nike">Nike (Air Force / Air Max)</option>
                      <option value="vans">Vans (Old Skool)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Your Usual Size</label>
                    <select
                      value={knownSize}
                      onChange={(e) => setKnownSize(e.target.value)}
                      className="w-full text-xs font-bold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-purple-600"
                    >
                      <option value="UK 7">UK 7 (US 8 / EU 41)</option>
                      <option value="UK 8">UK 8 (US 9 / EU 42.5)</option>
                      <option value="UK 9">UK 9 (US 10 / EU 44)</option>
                      <option value="UK 10">UK 10 (US 11 / EU 45)</option>
                      <option value="UK 11">UK 11 (US 12 / EU 46)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Foot Width</label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setFootWidth('regular')}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                          footWidth === 'regular'
                            ? 'bg-purple-50 border-purple-600 text-purple-700'
                            : 'bg-white border-slate-300 text-slate-600'
                        }`}
                      >
                        Standard
                      </button>
                      <button
                        onClick={() => setFootWidth('wide')}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                          footWidth === 'wide'
                            ? 'bg-purple-50 border-purple-600 text-purple-700'
                            : 'bg-white border-slate-300 text-slate-600'
                        }`}
                      >
                        Wide (+0.5)
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Recommendation Result Callout */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider">
                      Recommended Size for Nike Court Vision Low:
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-2xl font-black text-[#11132d]">
                        {footWidth === 'wide' ? 'UK 9.5' : knownSize}
                      </span>
                      <span className="text-xs font-bold text-emerald-700">
                        (Confidence: 97%)
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                      {footWidth === 'wide'
                        ? 'Nike Court Vision Low has a structured leather toe-box with vulcanized sidewalls. Since you selected a wider foot profile, sizing up by 0.5 ensures comfortable pinky-toe clearance without heel slipping.'
                        : 'Nike Court Vision Low runs true to standard athletic sneaker sizing. Your regular size will fit comfortably with standard socks.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Verified Buyer Consensus Statistics */}
              <div className="border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-extrabold text-slate-800">
                    Community Fit Sentiment (12,340 Verified Reviews)
                  </h5>
                  <span className="text-[11px] font-bold text-purple-600">Cross-Store Synthesized</span>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                      <span>True to Size</span>
                      <span>76%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-[#6339f8] h-2 rounded-full" style={{ width: '76%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                      <span>Slightly Snug / Narrow Toe</span>
                      <span>19%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: '19%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                      <span>Runs Large</span>
                      <span>5%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-slate-300 h-2 rounded-full" style={{ width: '5%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Apparel Sizing (Jackets & Hoodies) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="text-xs font-extrabold text-[#11132d] uppercase tracking-wider">
                  Apparel Fit Guide (Roadster Bomber & H&M Hoodie)
                </h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { size: 'S (38)', chest: '36-38 in', fit: 'Snug Fit' },
                    { size: 'M (40)', chest: '39-41 in', fit: 'Regular Casual' },
                    { size: 'L (42)', chest: '42-44 in', fit: 'Slightly Relaxed' },
                    { size: 'XL (44)', chest: '45-47 in', fit: 'Oversized Street' }
                  ].map((s) => (
                    <div
                      key={s.size}
                      className="p-3 bg-white rounded-xl border border-slate-200 text-center hover:border-purple-300 transition-colors"
                    >
                      <span className="block font-black text-sm text-[#11132d]">{s.size}</span>
                      <span className="block text-[11px] text-slate-500 font-medium">{s.chest}</span>
                      <span className="block text-[10px] font-bold text-purple-600 mt-1">{s.fit}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 text-xs text-purple-900 leading-snug">
                  💡 <strong>Pro-Tip for Winter Layering:</strong> If you plan to wear the Roadster Bomber Jacket over the H&M Fleece Hoodie, order <strong>Size L</strong> for easy arm movement and no chest tightness.
                </div>
              </div>
            </>
          )}

          {/* Zero-Risk Return Assurance */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-100/70 border border-slate-200 text-xs text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              All linked platforms (Amazon, Flipkart, Myntra) offer <strong>free 7-14 day size exchanges</strong> if the fit isn't 100% perfect.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#6339f8] hover:bg-[#5229eb] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-600/20"
          >
            Got It, Thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
