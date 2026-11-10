import React from 'react';
import { ShieldCheck, Info, CheckCircle2 } from 'lucide-react';

export const DemoModeBadge: React.FC = () => {
  return (
    <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-1.5 text-xs text-amber-900 select-none">
      <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full font-black text-[10px] bg-amber-200 text-amber-950 uppercase tracking-wider">
            DEMO DATA MODE
          </span>
          <span className="font-medium text-amber-950/90 text-[11px]">
            Marketplace feeds (Amazon, Flipkart, Meesho, Myntra) operate in sandboxed catalog mode with verifiable historical provenance.
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-semibold text-amber-800">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Robots.txt & Terms Compliant</span>
          </span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline text-amber-700 font-normal">
            No live credentials required for local testing
          </span>
        </div>
      </div>
    </div>
  );
};
