import React from 'react';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  Scale,
  Brain,
  CheckCircle2,
  HelpCircle,
  TrendingDown
} from 'lucide-react';
import { Recommendation } from '../types';

interface ExplainabilityModalProps {
  recommendation: Recommendation | null;
  onClose: () => void;
}

export const ExplainabilityModal: React.FC<ExplainabilityModalProps> = ({
  recommendation,
  onClose
}) => {
  if (!recommendation) return null;

  const { product, score_breakdown, reasons, sacrifice_tradeoffs, evidence, disagreements, badge, rank, overall_score } = recommendation;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/30 flex items-center justify-center text-purple-200">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
                <span>Explainable AI Decision Audit</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/40 text-purple-200 font-bold">
                  Rank #{rank}
                </span>
              </h3>
              <p className="text-xs text-purple-200/80">{product.canonical_title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-purple-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800 text-xs">
          {/* Deterministic Score Section */}
          <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-purple-600" />
                <span>Transparent Multi-Criteria Score: {overall_score} / 100</span>
              </span>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-100/90 px-2 py-0.5 rounded-full">
                Deterministic Weighted Function
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
              {Object.entries(score_breakdown || {}).map(([crit, val]) => (
                <div key={crit} className="bg-white rounded-xl p-2 border border-purple-100/80 shadow-2xs">
                  <p className="text-[10px] uppercase font-bold text-slate-400">{crit}</p>
                  <p className="text-sm font-black text-purple-900 mt-0.5">{val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Why Recommended: Positive Evidence */}
          <div>
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Key Reasons Recommended</span>
            </h4>
            <ul className="space-y-1.5">
              {reasons?.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-emerald-50/60 border border-emerald-100 p-2.5 rounded-xl">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What you Sacrifice: Honest Trade-offs */}
          <div>
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>What You Sacrifice by Choosing This Product</span>
            </h4>
            <ul className="space-y-1.5">
              {sacrifice_tradeoffs?.map((tradeoff, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-amber-50/70 border border-amber-200/70 p-2.5 rounded-xl">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                  <span className="text-slate-700 font-medium">{tradeoff}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Agent Disagreement Resolution */}
          {disagreements && disagreements.length > 0 && (
            <div className="border border-indigo-100 bg-indigo-50/60 rounded-2xl p-4">
              <h4 className="font-extrabold text-indigo-950 text-xs uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-indigo-600" />
                <span>Agent Disagreement & Resolution</span>
              </h4>
              {disagreements.map((dis, idx) => (
                <div key={idx} className="space-y-2 text-[11px] leading-relaxed">
                  <p className="font-semibold text-slate-700">
                    <strong className="text-indigo-900">Contending Agents:</strong> {dis.contending_agents?.join(' vs ')}
                  </p>
                  <p className="text-slate-600">
                    <strong className="text-slate-800">Price Agent Stance:</strong> {dis.price_agent_stance}
                  </p>
                  <p className="text-slate-600">
                    <strong className="text-slate-800">Review Intelligence Stance:</strong> {dis.review_agent_stance}
                  </p>
                  <div className="p-2 rounded-xl bg-white border border-indigo-200 text-indigo-900 font-semibold mt-1">
                    ⚖️ Resolution: {dis.resolution}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Verification Agent Claim Audits */}
          {evidence && evidence.length > 0 && (
            <div>
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Independent Verification Agent Fact-Checks</span>
              </h4>
              <div className="space-y-2">
                {evidence.map((ev, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200/90 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{ev.claim_text}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${ev.verified ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {ev.verified ? '✓ VERIFIED FACT' : '⚠ CLARIFIED'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      <strong>Source:</strong> {ev.evidence_source} (Confidence: {(ev.confidence * 100).toFixed(0)}%)
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            CartPilot AI uses transparent deterministic multi-criteria models. No sponsored bias.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
