import React from 'react';
import { ArrowRight, Star, Heart } from 'lucide-react';
import { BUSINESS_DETAILS } from '../data/restaurantData';
import heroFeastBg from '../assets/images/hero_lahore_feast_1795135325768.jpg';

interface HeroSectionProps {
  onOpenBooking: () => void;
  onExploreMenu: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenBooking,
  onExploreMenu,
}) => {
  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center pt-28 pb-16 overflow-hidden bg-[#090909]"
    >
      {/* Full-bleed hero background image with zero side shadows */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0"
      >
        <img
          src={heroFeastBg}
          alt="Wood-fired pizza, crispy chicken wings, double smash cheeseburger, charcoal-grilled ribeye steak, BBQ skewers, crispy fries, and fresh mint lemonade"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center brightness-[1.14] contrast-[1.05] saturate-[1.12]"
        />

        {/* Soft localized center cushion for text legibility while keeping the food feast bright and highlighted */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_56%_48%_at_50%_52%,rgba(9,9,9,0.54)_0%,rgba(9,9,9,0.22)_58%,rgba(9,9,9,0)_100%)]" />

        {/* Subtle top & bottom edge blend for header legibility and FeatureStrip seam */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#090909]/80 via-[#090909]/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#090909]/80 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center space-y-6">
          {/* Hero Heading - single line on top */}
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-none whitespace-nowrap drop-shadow-[0_6px_28px_rgba(0,0,0,0.95)]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F47812] to-[#FF8C2B]">
                FAST FOOD
              </span>
            </h1>
          </div>

          {/* Culinary heart emblem */}
          <div className="flex items-center justify-center gap-3 text-[#F47812] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#F47812]" />
            <Heart className="w-4 h-4 fill-[#F47812]" />
            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#F47812]" />
          </div>

          {/* Tagline / Detailed description */}
          <p className="text-base sm:text-lg text-white font-medium max-w-xl mx-auto leading-relaxed [text-shadow:0_2px_10px_rgba(0,0,0,0.95),0_4px_24px_rgba(0,0,0,0.9)]">
            Delicious meals made with fresh ingredients, served with love. Experience traditional charcoal BBQ and artisanal continental grills in Gulberg III, Lahore.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onExploreMenu}
              className="px-7 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider bg-[#F47812] hover:bg-[#D96509] text-white flex items-center gap-2 shadow-xl shadow-[#F47812]/30 hover:shadow-2xl hover:shadow-[#F47812]/50 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>VIEW MENU</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenBooking}
              className="px-7 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider bg-black/45 backdrop-blur-sm hover:bg-white/15 text-white border-2 border-white/85 hover:border-white transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              RESERVE NOW
            </button>
          </div>

          {/* Customer Trust Indicator / Review */}
          <div className="pt-4 w-full max-w-md mx-auto flex flex-wrap items-center justify-center gap-6 border-t border-white/20">
            <div className="flex items-center justify-center gap-2 [text-shadow:0_2px_10px_rgba(0,0,0,0.95)]">
              <div className="flex text-[#C9A45C]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#C9A45C]" />
                ))}
              </div>
              <span className="text-sm font-bold text-white">4.7 / 5</span>
              <span className="text-xs text-neutral-200">({BUSINESS_DETAILS.reviewsCount} Reviews)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

