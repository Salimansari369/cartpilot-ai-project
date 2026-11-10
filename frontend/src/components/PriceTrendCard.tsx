import React from 'react';
import {
  Percent
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis
} from 'recharts';
import { PriceTrendData } from '../types';

interface PriceTrendCardProps {
  trendData: PriceTrendData;
  onSetAlert?: () => void;
}

export const PriceTrendCard: React.FC<PriceTrendCardProps> = ({
  trendData,
}) => {
  const chartPoints = trendData?.points || [
    { month: 'Aug', price: 7000 },
    { month: 'Sep', price: 6000 },
    { month: 'Oct', price: 5000 },
    { month: 'Nov', price: 4499 }
  ];

  return (
    <div className="bg-white rounded-[26px] border border-[#e5e8f5] p-5 shadow-xs flex flex-col justify-between select-none">
      <div>
        {/* Header Row */}
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-extrabold text-[#11132d] text-[15px] tracking-tight leading-tight">
            Price Trend & Deal Insight
          </h2>

          <div className="flex flex-col items-end px-2.5 py-1 rounded-xl bg-[#ebfbf2] border border-[#c6f1d9] text-[#16a34a] text-right flex-shrink-0">
            <span className="text-xs font-black leading-none">
              ↓ ₹2,500 lower
            </span>
            <span className="text-[10px] font-semibold text-[#16a34a] mt-0.5 leading-none">
              than last month
            </span>
          </div>
        </div>

        {/* Current Price */}
        <div className="mt-2">
          <p className="text-[11px] text-[#787b99] font-medium leading-none">Current Price</p>
          <p className="text-2xl font-black text-[#11132d] mt-1 tracking-tight">
            ₹{trendData?.current_price?.toLocaleString() || '4,499'}
          </p>
        </div>

        {/* Sparkline Area Chart */}
        <div className="mt-2 h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartPoints} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="purpleTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c5cfc" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#7c5cfc" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#484b6a', fontSize: 11, fontWeight: 600 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                ticks={[4000, 5000, 6000, 7000]}
                tickFormatter={(val) => `${Math.round(val / 1000)}K`}
                domain={[3500, 7500]}
                tick={{ fill: '#7d809f', fontSize: 11, fontWeight: 500 }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#6339f8"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#purpleTrend)"
                dot={(props: any) => {
                  const { cx, cy, index } = props;
                  // Only show dot on the final November point like in the screenshot
                  if (index === chartPoints.length - 1) {
                    return (
                      <circle
                        key={index}
                        cx={cx}
                        cy={cy}
                        r={4.5}
                        fill="#6339f8"
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    );
                  }
                  return <React.Fragment key={index} />;
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insight Banner at the bottom */}
      <div className="mt-3 p-3 rounded-2xl bg-[#f2effe] border border-[#ded8fd] flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-[#ded8fd] flex items-center justify-center text-[#6339f8] flex-shrink-0">
          <Percent className="w-4 h-4 stroke-[2.5]" />
        </div>
        <p className="text-[11px] text-[#1c1e38] font-semibold leading-snug">
          <span className="font-extrabold text-[#6339f8]">Buy Now:</span> Price is 36% lower than average (₹6,999). Good time to buy!
        </p>
      </div>
    </div>
  );
};
