import React, { useState } from 'react';
import {
  Brain,
  Check,
  ChevronDown,
  ChevronUp,
  Activity
} from 'lucide-react';
import { AgentEvent } from '../types';

interface AgenticWorkflowPanelProps {
  events?: AgentEvent[];
  isRunning?: boolean;
  category?: string;
}

export const AgenticWorkflowPanel: React.FC<AgenticWorkflowPanelProps> = ({
  events = [],
  isRunning = false,
  category = 'electronics'
}) => {
  const [showTrace, setShowTrace] = useState(false);
  const isFashion = category.toLowerCase() === 'fashion';
  const isHome = category.toLowerCase() === 'home';
  const isBeauty = category.toLowerCase() === 'beauty';
  const isBooks = category.toLowerCase() === 'books';

  const defaultWorkflowSteps = [
    {
      title: 'Understand your need',
      subtitle: 'Budget, use-case, preferences',
    },
    {
      title: 'Search across platforms',
      subtitle: 'Amazon, Flipkart, Meesho, Myntra',
    },
    {
      title: 'Analyze & compare',
      subtitle: 'Specs, prices, reviews, ratings',
    },
    {
      title: 'Reason & recommend',
      subtitle: 'Top options with best value',
    },
  ];

  const fashionWorkflowSteps = [
    {
      title: 'Understand your need',
      subtitle: 'Category: Fashion, Budget: ₹3,000, Style: Casual',
    },
    {
      title: 'Search across platforms',
      subtitle: 'Amazon, Flipkart, Myntra, Ajio',
    },
    {
      title: 'Analyze & compare',
      subtitle: 'Price, material, ratings, reviews',
    },
    {
      title: 'Reason & recommend',
      subtitle: 'Best value, style match, and offers',
    },
  ];

  const homeWorkflowSteps = [
    {
      title: 'Understand your need',
      subtitle: 'Category: Home & Living, Focus: Comfort & Ergonomics',
    },
    {
      title: 'Search across platforms',
      subtitle: 'Amazon, Flipkart, Brand Stores',
    },
    {
      title: 'Analyze & compare',
      subtitle: 'Dimensions, durability, suction, power rating',
    },
    {
      title: 'Reason & recommend',
      subtitle: 'Long-term reliability and lowest price',
    },
  ];

  const beautyWorkflowSteps = [
    {
      title: 'Understand your need',
      subtitle: 'Category: Beauty & Care, Focus: Skin Barrier Safe',
    },
    {
      title: 'Search across platforms',
      subtitle: 'Amazon, Nykaa, Flipkart, Myntra',
    },
    {
      title: 'Analyze & compare',
      subtitle: 'Actives, ceramides, comedogenic safety, reviews',
    },
    {
      title: 'Reason & recommend',
      subtitle: 'Dermatologist tested best value formulas',
    },
  ];

  const booksWorkflowSteps = [
    {
      title: 'Understand your need',
      subtitle: 'Category: Books, Focus: Habits, Wealth & Mindset',
    },
    {
      title: 'Search across platforms',
      subtitle: 'Amazon, Flipkart, Direct Publishers',
    },
    {
      title: 'Analyze & compare',
      subtitle: 'Paperback quality, translation, seller ratings',
    },
    {
      title: 'Reason & recommend',
      subtitle: 'Verified authentic prints and best discounts',
    },
  ];

  const workflowSteps = isFashion
    ? fashionWorkflowSteps
    : isHome
    ? homeWorkflowSteps
    : isBeauty
    ? beautyWorkflowSteps
    : isBooks
    ? booksWorkflowSteps
    : defaultWorkflowSteps;

  return (
    <div className="bg-white rounded-[28px] border border-[#e1e4fa] p-5 lg:p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 mb-3.5">
          <div className="flex items-center gap-2.5">
            {/* Brain Icon in Purple */}
            <div className="text-[#6339f8]">
              <Brain className="w-5 h-5" />
            </div>
            <h2 className="font-extrabold text-[#11132d] text-base tracking-tight">
              Agentic Workflow
            </h2>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ebfbf2] border border-[#c6f1d9] text-[#16a34a] text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
            <span>Live</span>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-3.5">
          {workflowSteps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#6339f8] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-[#11132d] leading-none">
                  {step.title}
                </p>
                <p className="text-[11px] text-[#636688] mt-1 font-medium">
                  {step.subtitle}
                </p>
              </div>
            </div>
          ))}

          {/* 5th Step: Final Card with Flag */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#f2effe] border border-[#ded8fd]">
            <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-[#6339f8] flex-shrink-0">
              <svg 
                className="w-3.5 h-3.5 fill-[#6339f8]" 
                viewBox="0 0 24 24"
              >
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                <line x1="4" y1="22" x2="4" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-xs font-extrabold text-[#1b1d3d] leading-tight">
              {isFashion
                ? 'Done! Here are your fashion recommendations ✨'
                : isHome
                ? 'Done! Here are your home recommendations 🛋️'
                : isBeauty
                ? 'Done! Here are your beauty recommendations ✨'
                : isBooks
                ? 'Done! Here are your book recommendations 📚'
                : 'Done! Here are your recommendations 🥳'}
            </p>
          </div>
        </div>
      </div>

      {/* Trace Log Toggle */}
      <div className="mt-4 pt-2 border-t border-slate-100">
        <button
          onClick={() => setShowTrace(!showTrace)}
          className="w-full flex items-center justify-between text-[11px] font-bold text-[#6339f8] hover:text-[#5127ee] transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Activity className="w-3 h-3" />
            <span>Traceable Logs ({events.length || 5})</span>
          </span>
          {showTrace ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showTrace && (
          <div className="mt-2 max-h-36 overflow-y-auto space-y-1 text-[10px] font-mono bg-slate-900 text-slate-200 p-2 rounded-xl">
            {events.map((ev, i) => (
              <p key={i} className="leading-tight">
                <span className="text-purple-400 font-bold">[{ev.agent_name.toUpperCase()}]:</span> {ev.message}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
