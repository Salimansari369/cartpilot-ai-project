import React, { useState } from 'react';
import {
  X,
  Sliders,
  RotateCcw,
  Sparkles,
  Save,
  Info
} from 'lucide-react';
import { UserPreferences, Recommendation } from '../types';

interface PreferenceSlidersModalProps {
  preferences: UserPreferences;
  onSavePreferences: (prefs: UserPreferences) => void;
  onSimulate: (prefs: UserPreferences) => void;
  simulationExplanation?: string;
  onClose: () => void;
}

export const PreferenceSlidersModal: React.FC<PreferenceSlidersModalProps> = ({
  preferences,
  onSavePreferences,
  onSimulate,
  simulationExplanation,
  onClose
}) => {
  const [weights, setWeights] = useState<UserPreferences>({ ...preferences });

  const handleChange = (key: keyof UserPreferences, value: number) => {
    const updated = { ...weights, [key]: value };
    setWeights(updated);
    onSimulate(updated);
  };

  const handleReset = () => {
    const defaultPrefs: UserPreferences = {
      price_weight: 0.25,
      performance_weight: 0.25,
      battery_weight: 0.20,
      comfort_weight: 0.15,
      reliability_weight: 0.15
    };
    setWeights(defaultPrefs);
    onSimulate(defaultPrefs);
  };

  const handleSave = () => {
    onSavePreferences(weights);
    onClose();
  };

  const sliders = [
    { key: 'price_weight', label: 'Price & Value Weight', desc: 'Prioritizes lower retail costs, high discounts & budget deals', min: 0.05, max: 0.6, step: 0.05 },
    { key: 'performance_weight', label: 'Audio / Hardware Performance', desc: 'Prioritizes ANC, low latency (~40ms), driver diameter & processors', min: 0.05, max: 0.6, step: 0.05 },
    { key: 'battery_weight', label: 'Battery Longevity', desc: 'Weights 70h+ playback capacity and quick-charge capabilities', min: 0.05, max: 0.6, step: 0.05 },
    { key: 'comfort_weight', label: 'Comfort & Ergonomics', desc: 'Favors lightweight frames (<200g), memory foam & low head pressure', min: 0.05, max: 0.6, step: 0.05 },
    { key: 'reliability_weight', label: 'Review Authenticity & Reliability', desc: 'Weights verified purchase ratios, brand warranty & return ease', min: 0.05, max: 0.6, step: 0.05 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0e0f2b] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/30 flex items-center justify-center text-purple-200">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight text-white">
                Personalize Decision Weights
              </h3>
              <p className="text-xs text-purple-200/80">
                Tune criteria to see instant rankings adjustment
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

        {/* Sliders Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div className="space-y-4">
            {sliders.map((s) => {
              const val = (weights as any)[s.key] || 0.2;
              return (
                <div key={s.key} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-slate-900">{s.label}</span>
                      <p className="text-[11px] text-slate-500">{s.desc}</p>
                    </div>
                    <span className="text-xs font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded-lg">
                      {Math.round(val * 100)}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min={s.min}
                    max={s.max}
                    step={s.step}
                    value={val}
                    onChange={(e) => handleChange(s.key as keyof UserPreferences, parseFloat(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>
              );
            })}
          </div>

          {/* Dynamic Shift Explanation Box */}
          <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-purple-900 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Real-Time Ranking Impact</span>
            </div>
            <p className="text-slate-700 leading-relaxed font-medium">
              {simulationExplanation || 'Adjust the sliders above to see how weights immediately recalculate scores across all candidate models.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#6c47ff] hover:bg-[#5830eb] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Apply</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
