import React from 'react';
import {
  Star,
  Scale,
  TrendingUp,
  MessageSquare,
  Info
} from 'lucide-react';

interface TabsBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  compareCount: number;
}

export const TabsBar: React.FC<TabsBarProps> = ({
  activeTab,
  onTabChange,
  compareCount,
}) => {
  const tabs = [
    { id: 'top', label: 'Top Recommendations', icon: Star },
    { id: 'compare', label: `Compare (${compareCount || 3})`, icon: Scale },
    { id: 'trend', label: 'Price Trend', icon: TrendingUp },
    { id: 'reviews', label: 'Review Summary', icon: MessageSquare },
    { id: 'why', label: 'Why Recommended?', icon: Info },
  ];

  return (
    <div className="flex items-center gap-6 sm:gap-8 border-b border-[#e1e4fa] pb-1 overflow-x-auto select-none no-scrollbar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 py-3 text-[13px] font-bold whitespace-nowrap transition-all border-b-2 -mb-[1px] ${
              isActive
                ? 'border-[#6339f8] text-[#6339f8]'
                : 'border-transparent text-[#2c2f4a] hover:text-[#11132d]'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-[#6339f8]' : 'text-[#363852]'}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
