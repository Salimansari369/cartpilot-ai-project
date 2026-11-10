import React from 'react';
import {
  X,
  Scale,
  Check,
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Recommendation } from '../types';

interface CompareModalProps {
  recommendations: Recommendation[];
  onClose: () => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  recommendations,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0e0f2b] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/30 flex items-center justify-center text-purple-200">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight text-white">
                Cross-Platform Side-by-Side Comparison
              </h3>
              <p className="text-xs text-purple-200/80">
                Normalized specifications and multi-store offers
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

        {/* Comparison Table */}
        <div className="p-6 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="p-3 font-bold text-slate-400 uppercase tracking-wider w-40">Attribute</th>
                {recommendations.map((rec) => (
                  <th key={rec.id} className="p-3 min-w-[200px]">
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                        {rec.badge || `Rank #${rec.rank}`}
                      </span>
                      <span className="font-black text-slate-900 text-sm mt-1">{rec.product.canonical_title}</span>
                      <span className="text-base font-extrabold text-purple-700">
                        ₹{rec.product.offers?.[0]?.price?.toLocaleString() || '4,499'}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {/* Active Noise Cancellation */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-slate-900 bg-slate-50/50">Active Noise Cancellation</td>
                {recommendations.map((rec) => (
                  <td key={rec.id} className="p-3">
                    {rec.product.base_specifications?.has_anc ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                        <Check className="w-3 h-3 stroke-[3]" /> Yes (Active ANC)
                      </span>
                    ) : (
                      <span className="text-slate-400">Passive Isolation Only</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Battery Playback */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-slate-900 bg-slate-50/50">Battery Playback</td>
                {recommendations.map((rec) => (
                  <td key={rec.id} className="p-3 font-bold text-slate-800">
                    {rec.product.base_specifications?.battery_hours ? `${rec.product.base_specifications.battery_hours} Hours` : '50+ Hours'}
                  </td>
                ))}
              </tr>

              {/* Gaming Latency */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-slate-900 bg-slate-50/50">Audio Latency</td>
                {recommendations.map((rec) => (
                  <td key={rec.id} className="p-3">
                    {rec.product.base_specifications?.latency_ms ? (
                      <span className={rec.product.base_specifications.latency_ms <= 50 ? 'text-emerald-700 font-bold' : 'text-slate-600'}>
                        ~{rec.product.base_specifications.latency_ms}ms
                      </span>
                    ) : (
                      '~100ms'
                    )}
                  </td>
                ))}
              </tr>

              {/* Weight */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-slate-900 bg-slate-50/50">Chassis Weight</td>
                {recommendations.map((rec) => (
                  <td key={rec.id} className="p-3">
                    {rec.product.base_specifications?.weight_g ? `${rec.product.base_specifications.weight_g}g` : '240g'}
                  </td>
                ))}
              </tr>

              {/* User Rating */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-slate-900 bg-slate-50/50">Customer Rating</td>
                {recommendations.map((rec) => (
                  <td key={rec.id} className="p-3 font-bold text-amber-600">
                    ★ {rec.product.rating} ({rec.product.review_count?.toLocaleString()} reviews)
                  </td>
                ))}
              </tr>

              {/* Best Platform & Direct Action */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-slate-900 bg-slate-50/50">Best Verified Offer</td>
                {recommendations.map((rec) => {
                  const o = rec.product.offers?.[0];
                  return (
                    <td key={rec.id} className="p-3">
                      <div className="space-y-1">
                        <p className="font-bold capitalize text-slate-900">{o?.platform} ({o?.seller_name})</p>
                        <p className="text-[11px] text-slate-500">{o?.delivery_days} day delivery • {o?.return_policy}</p>
                        <a
                          href={o?.url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 hover:underline mt-1"
                        >
                          <span>Open Merchant Listing</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
