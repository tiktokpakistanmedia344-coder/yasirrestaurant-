import React from 'react';
import { Flame, Sparkles, Check, ArrowRight, Clock, Users } from 'lucide-react';
import type { DealItem } from '../types/restaurant';
import { BIG_DEALS } from '../data/restaurantData';

interface BigDealsSectionProps {
  onSelectDeal: (deal: DealItem) => void;
}

export const BigDealsSection: React.FC<BigDealsSectionProps> = ({ onSelectDeal }) => {
  return (
    <section id="deals" className="py-24 bg-[#090909] relative overflow-hidden scroll-mt-24">
      {/* Background fire glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#F47812]/10 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F47812]/20 border border-[#F47812]/40 text-[#F47812] text-xs uppercase font-extrabold tracking-widest mb-3">
            <Flame className="w-4 h-4 fill-[#F47812] animate-bounce" />
            <span>LIMITED TIME SIZZLING COMBOS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Big Deals & Family Combos
          </h2>

          <p className="mt-3 text-sm sm:text-base text-neutral-400">
            Enjoy exclusive value feasts crafted for family gatherings, friends hangouts, and celebrations. All packages include fresh accompaniments and chilled beverages.
          </p>
        </div>

        {/* 5 Big Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BIG_DEALS.map((deal, idx) => (
            <div
              key={deal.id}
              onClick={() => onSelectDeal(deal)}
              className={`group rounded-3xl bg-[#141414] border border-[#2a2a2a] hover:border-[#F47812] shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between overflow-hidden cursor-pointer ${
                idx === 0 ? 'lg:col-span-2' : ''
              }`}
            >
              {/* Image Header with Sizzling Badge */}
              <div
                className={`relative overflow-hidden bg-[#1a1a1a] ${
                  idx === 0 ? 'h-64 sm:h-72' : 'h-56'
                }`}
              >
                <img
                  src={deal.image}
                  alt={deal.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/60 pointer-events-none" />

                {/* Badges on top */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#F47812] text-white shadow-lg flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 fill-white" />
                    {deal.badge}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md text-white border border-white/10">
                    {deal.dealNumber}
                  </span>
                </div>

                {/* Savings Tag */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-600 text-white shadow-lg">
                  {deal.savingsDisplay}
                </div>
              </div>

              {/* Deal Content */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <div className="flex items-center gap-3 text-xs text-neutral-400 mb-2">
                    <span className="flex items-center gap-1 text-[#F47812] font-semibold">
                      <Users className="w-3.5 h-3.5" />
                      {deal.servings}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Freshly Prepared
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white group-hover:text-[#F47812] transition-colors">
                    {deal.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    {deal.shortDescription}
                  </p>

                  {/* Included Items Checklist */}
                  <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">
                      Included in this deal:
                    </span>
                    {deal.includes.slice(0, 4).map((inc, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-neutral-300">
                        <Check className="w-3.5 h-3.5 text-[#F47812] flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{inc}</span>
                      </div>
                    ))}
                    {deal.includes.length > 4 && (
                      <p className="text-[11px] text-[#F47812] font-semibold pl-5">
                        +{deal.includes.length - 4} more items included
                      </p>
                    )}
                  </div>
                </div>

                {/* Price & Action Button */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-[#F47812]">
                        {deal.priceDisplay}
                      </span>
                      <span className="text-xs sm:text-sm line-through text-neutral-500 font-semibold">
                        {deal.originalPriceDisplay}
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-400 uppercase font-semibold">
                      Special Promotional Price
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDeal(deal);
                    }}
                    className="px-5 py-3 rounded-full font-bold text-xs uppercase tracking-wider bg-[#F47812] hover:bg-[#D96509] text-white flex items-center gap-1.5 shadow-lg shadow-[#F47812]/25 transition-all cursor-pointer"
                  >
                    <span>BUY THIS DEAL</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
