import React from 'react';
import {
  Home,
  Bot,
  Scale,
  LineChart,
  Sparkles,
  Heart,
  ShoppingCart,
  Package,
  Tv,
  Shirt,
  Armchair,
  Sparkle,
  BookOpen,
  Check,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenManagePlatforms: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  selectedCategory,
  onSelectCategory,
  onOpenManagePlatforms
}) => {
  const mainNav = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'agent', label: 'AI Shopping Agent', icon: Bot },
    { id: 'compare', label: 'Product Compare', icon: Scale },
    { id: 'tracker', label: 'Price Tracker', icon: LineChart },
    { id: 'recommendations', label: 'Recommendations', icon: Sparkles },
    { id: 'wishlist', label: 'My Wishlist', icon: Heart },
    { id: 'cart', label: 'Smart Cart', icon: ShoppingCart },
    { id: 'orders', label: 'Orders', icon: Package },
  ];

  const forYouCategories = [
    { id: 'electronics', label: 'Electronics', icon: Tv },
    { id: 'fashion', label: 'Fashion', icon: Shirt },
    { id: 'home', label: 'Home & Living', icon: Armchair },
    { id: 'beauty', label: 'Beauty & Personal Care', icon: Sparkle },
    { id: 'books', label: 'Books & More', icon: BookOpen },
  ];

  return (
    <aside className="w-60 flex-shrink-0 bg-white border-r border-[#eceef5] py-5 px-4 min-h-[calc(100vh-65px)] select-none">
      <div className="space-y-6">
        {/* Main Nav Items */}
        <nav className="space-y-1">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || (item.id === 'dashboard' && (currentView === 'home' || currentView === 'dashboard'));
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13px] font-semibold transition-all text-left ${
                  isActive
                    ? 'bg-[#ece9fe] text-[#6339f8]'
                    : 'text-[#2b2d42] hover:bg-[#f6f7fc]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#6339f8]' : 'text-[#4a4d68]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Section: Shop by Category */}
        <div>
          <h3 className="px-3 text-[12px] font-extrabold text-[#11132d] mb-2.5">
            Shop by Category
          </h3>
          <div className="space-y-1">
            {forYouCategories.map((cat) => {
              const Icon = cat.icon;
              const isCatActive = selectedCategory.toLowerCase() === cat.id.toLowerCase();
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[12.5px] font-semibold text-left transition-all ${
                    isCatActive
                      ? 'bg-[#f4f1fe] text-[#6339f8] shadow-2xs font-bold'
                      : 'text-[#2e3150] hover:bg-[#f6f7fc]'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isCatActive ? 'text-[#6339f8]' : 'text-[#5d607e]'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section: Connected Platforms */}
        <div>
          <h3 className="px-3 text-[12px] font-extrabold text-[#11132d] mb-3">
            Connected Platforms
          </h3>
          <div className="flex items-center gap-2 px-2">
            {/* Amazon */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center p-1">
                <span className="text-black font-extrabold text-sm tracking-tighter">a</span>
              </div>
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
            </div>

            {/* Flipkart */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-8 h-8 rounded-xl bg-[#ffe500] border border-amber-300 shadow-2xs flex items-center justify-center p-1">
                <span className="text-[#2874f0] font-black text-xs italic">f</span>
              </div>
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
            </div>

            {/* Meesho */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-8 h-8 rounded-xl bg-[#831843] border border-pink-900 shadow-2xs flex items-center justify-center p-1">
                <span className="text-white font-extrabold text-xs">m</span>
              </div>
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
            </div>

            {/* Myntra */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center p-1">
                <span className="font-black text-xs bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">M</span>
              </div>
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
            </div>
          </div>

          <button
            onClick={onOpenManagePlatforms}
            className="mt-3 px-3 flex items-center gap-1 text-[11px] font-bold text-[#6339f8] hover:text-[#4d25dc] transition-colors"
          >
            <span>Manage Connections</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
