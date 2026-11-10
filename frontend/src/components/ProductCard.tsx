import React from 'react';
import {
  Trophy,
  Gamepad2,
  DollarSign,
  Heart,
  Star,
  Check,
  ShoppingCart
} from 'lucide-react';
import { Recommendation } from '../types';

interface ProductCardProps {
  recommendation: Recommendation;
  onAddToCart: (prodId: number) => void;
  onToggleWishlist: (prodId: number) => void;
  onViewTradeoffs?: (rec: Recommendation) => void;
  isWishlisted?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  recommendation,
  onAddToCart,
  onToggleWishlist,
  onViewTradeoffs,
  isWishlisted = false
}) => {
  const { product, badge } = recommendation;
  const bestOffer = product.offers?.[0] || {
    platform: 'amazon',
    price: 4499,
    original_price: 6999,
    discount_pct: 36,
  };

  // Badge Styling exactly like screenshot
  const getBadgeConfig = (b?: string) => {
    const text = b || 'Best Overall';
    if (text.includes('Overall')) {
      return {
        bg: 'bg-[#fff1d6] text-[#8a4b08] border-[#fed899]',
        icon: '⭐',
        label: 'Best Overall'
      };
    }
    if (text.includes('Trendy')) {
      return {
        bg: 'bg-[#e8faea] text-[#166534] border-[#c0f3c7]',
        icon: '🌿',
        label: 'Trendy Pick'
      };
    }
    if (text.includes('Gaming')) {
      return {
        bg: 'bg-[#e8faea] text-[#166534] border-[#c0f3c7]',
        icon: '🎮',
        label: 'Best for Gaming'
      };
    }
    if (text.includes('Value for Money') || text.includes('Value')) {
      return {
        bg: 'bg-[#f4ebfe] text-[#7822c9] border-[#e9d6fe]',
        icon: '💎',
        label: text.includes('Value for Money') ? 'Value for Money' : 'Best Value'
      };
    }
    return {
      bg: 'bg-[#fef8e2] text-[#854d0e] border-[#fde8a0]',
      icon: '💰',
      label: 'Best Value'
    };
  };

  const badgeConfig = getBadgeConfig(badge);

  // Platform Logo matching screenshot
  const renderPlatformLogo = (platform: string) => {
    const p = platform.toLowerCase();
    if (p === 'amazon') {
      return (
        <div className="flex items-center gap-1 font-black text-sm text-black tracking-tight select-none">
          <span>amazon</span>
        </div>
      );
    }
    if (p === 'flipkart') {
      return (
        <div className="flex items-center gap-1 font-bold text-xs text-[#2874f0] select-none">
          <span className="font-extrabold italic text-sm">Flipkart</span>
          <span className="w-3.5 h-3.5 rounded-sm bg-[#ffe500] text-blue-700 text-[10px] font-black flex items-center justify-center">🛍</span>
        </div>
      );
    }
    if (p === 'myntra') {
      return (
        <div className="flex items-center gap-1 font-black text-xs text-black select-none">
          <span className="font-black text-sm bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">M</span>
          <span className="font-bold text-xs text-slate-800">Myntra</span>
        </div>
      );
    }
    if (p === 'meesho') {
      return (
        <div className="flex items-center gap-1.5 font-bold text-xs select-none">
          <span className="w-4 h-4 rounded-full bg-[#9f2066] text-white text-[10px] font-black flex items-center justify-center leading-none">m</span>
          <span className="font-extrabold text-xs text-[#9f2066]">Meesho</span>
        </div>
      );
    }
    return (
      <span className="font-bold text-xs text-slate-700 capitalize">{platform}</span>
    );
  };

  return (
    <div className="bg-white rounded-[26px] border border-[#e5e8f5] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between select-none">
      <div>
        {/* Top Header: Badge + Heart Wishlist */}
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${badgeConfig.bg}`}>
            <span>{badgeConfig.icon}</span>
            <span>{badgeConfig.label}</span>
          </span>

          <button
            onClick={() => onToggleWishlist(product.id)}
            className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
          </button>
        </div>

        {/* Product Image */}
        <div className="my-4 h-40 w-full flex items-center justify-center p-1 overflow-hidden">
          <img
            src={product.thumbnail_url || '/fashion_nike_sneaker.png'}
            alt={product.canonical_title}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/fashion_nike_sneaker.png';
            }}
            className="max-h-full max-w-full object-contain rounded-xl transition-transform hover:scale-105 duration-300"
          />
        </div>

        {/* Title */}
        <h3 className="font-extrabold text-[#11132d] text-base leading-tight">
          {product.canonical_title}
        </h3>

        {/* Rating and Reviews */}
        <div className="mt-1.5 flex items-center gap-1 text-xs">
          <Star className="w-3.5 h-3.5 fill-[#f59e0b] text-[#f59e0b]" />
          <span className="font-extrabold text-[#11132d]">{product.rating.toFixed(1)}</span>
          <span className="text-[#646888] font-medium">
            ({product.review_count?.toLocaleString()} reviews)
          </span>
        </div>

        {/* 3 Key Feature Bullets */}
        <ul className="mt-3 space-y-1.5 text-xs text-[#1e2038] font-semibold">
          {product.key_features?.slice(0, 3).map((feat, i) => (
            <li key={i} className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#16a34a] stroke-[3] flex-shrink-0" />
              <span className="truncate">{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Price & Checkout Row */}
      <div className="mt-5 pt-3">
        {/* Pricing */}
        <div className="flex items-baseline gap-2 mb-3.5">
          <span className="text-[22px] font-extrabold text-[#11132d] tracking-tight">
            ₹{bestOffer.price?.toLocaleString()}
          </span>
          {bestOffer.original_price > bestOffer.price && (
            <span className="text-xs text-[#8f92b2] line-through font-medium">
              ₹{bestOffer.original_price?.toLocaleString()}
            </span>
          )}
          {bestOffer.discount_pct > 0 && (
            <span className="text-xs font-extrabold text-[#16a34a]">
              {bestOffer.discount_pct}% off
            </span>
          )}
        </div>

        {/* Merchant Logo + Solid Purple Add to Cart Button */}
        <div className="flex items-center justify-between gap-2">
          <div>
            {renderPlatformLogo(bestOffer.platform)}
          </div>

          <button
            onClick={() => onAddToCart(product.id)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#6339f8] hover:bg-[#5229eb] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
