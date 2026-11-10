import React from 'react';
import {
  ShoppingCart,
  Bell,
  Heart,
  FileText,
  Sparkles,
  Sliders,
  TrendingUp,
  Wand2
} from 'lucide-react';

interface FooterShortcutsProps {
  onOpenCart: () => void;
  onOpenAlerts: () => void;
  onOpenWishlist: () => void;
  onOpenReviews: () => void;
  onOpenPersonalized: () => void;
  onOpenStyleAssistant?: () => void;
  onOpenSizeGuide?: () => void;
  onOpenTrends?: () => void;
  category?: string;
}

export const FooterShortcuts: React.FC<FooterShortcutsProps> = ({
  onOpenCart,
  onOpenAlerts,
  onOpenWishlist,
  onOpenReviews,
  onOpenPersonalized,
  onOpenStyleAssistant,
  onOpenSizeGuide,
  onOpenTrends,
  category = 'electronics'
}) => {
  const isFashion = category.toLowerCase() === 'fashion';

  const defaultItems = [
    {
      id: 'cart',
      title: 'Smart Cart',
      desc: 'Auto-picks lowest prices across platforms',
      icon: ShoppingCart,
      color: 'bg-[#eeebfd] text-[#6339f8]',
      action: onOpenCart,
    },
    {
      id: 'alerts',
      title: 'Price Alerts',
      desc: 'Get notified on price drops & new deals',
      icon: Bell,
      color: 'bg-[#eeebfd] text-[#6339f8]',
      action: onOpenAlerts,
    },
    {
      id: 'wishlist',
      title: 'Wishlist Sync',
      desc: 'Keep favorites from all platforms in one place',
      icon: Heart,
      color: 'bg-[#eeebfd] text-[#6339f8]',
      action: onOpenWishlist,
    },
    {
      id: 'reviews',
      title: 'Review Summarizer',
      desc: 'AI summary of thousands of real reviews',
      icon: FileText,
      color: 'bg-[#eeebfd] text-[#6339f8]',
      action: onOpenReviews,
    },
    {
      id: 'picks',
      title: 'Personalized Picks',
      desc: 'Recommendations based on your style, budget & usage',
      icon: Sparkles,
      color: 'bg-[#eeebfd] text-[#6339f8]',
      action: onOpenPersonalized,
    },
  ];

  const fashionItems = [
    {
      id: 'style_assistant',
      title: 'AI Style Assistant',
      desc: 'Get outfit and style suggestions',
      icon: Wand2,
      color: 'bg-[#eeebfd] text-[#6339f8]',
      action: onOpenStyleAssistant || onOpenPersonalized,
    },
    {
      id: 'size_guide',
      title: 'Size & Fit Guide',
      desc: 'Find your perfect size',
      icon: Sliders,
      color: 'bg-[#eeebfd] text-[#6339f8]',
      action: onOpenSizeGuide || onOpenReviews,
    },
    {
      id: 'alerts',
      title: 'Price Alerts',
      desc: 'Get notified on price drops',
      icon: Bell,
      color: 'bg-[#eeebfd] text-[#6339f8]',
      action: onOpenAlerts,
    },
    {
      id: 'wishlist',
      title: 'Wishlist Sync',
      desc: 'Save and track your favorites',
      icon: Heart,
      color: 'bg-[#eeebfd] text-[#6339f8]',
      action: onOpenWishlist,
    },
    {
      id: 'trend_explorer',
      title: 'Trend Explorer',
      desc: "Discover what's trending now",
      icon: TrendingUp,
      color: 'bg-[#eeebfd] text-[#6339f8]',
      action: onOpenTrends || onOpenCart,
    },
  ];

  const items = isFashion ? fashionItems : defaultItems;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-4 pb-6 select-none">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            onClick={item.action}
            className="bg-white rounded-[22px] border border-[#e5e8f5] p-3.5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center gap-3 group"
          >
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
              <Icon className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-extrabold text-[#11132d] group-hover:text-[#6339f8] transition-colors leading-tight">
                {item.title}
              </h4>
              <p className="text-[11px] text-[#666988] mt-0.5 leading-snug truncate">
                {item.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
